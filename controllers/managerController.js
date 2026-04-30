import fs from "fs/promises";
import mongoose from "mongoose";

import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import pharmacyModel from "../models/pharmacyModel.js";
import productModel from "../models/productModel.js";
import productNameModel from "../models/productNameModel.js";
import sellerModel from "../models/sellerModel.js";
import issueLogModel from "../models/issueLogModel.js";

import {
  generateRandomPhone,
  getRandomTelegramId,
} from "../db_service/db_utils.js";
import { formatDate, handleServerError, uniqueByName } from "../utils/utils.js";
import { test_getRandomNumber } from "../utils/tests.js";
import { warehouse_employees } from "../data/data.js";

// API to get dashboard data for manager view
const getDashboardData = async (req, res) => {
  console.log("getDashboardData - start");

  try {
    const [
      productStats,
      salesByPharmacy,
      pharmacyCount,
      sellerCount,
      topSalesBySeller,
    ] = await Promise.all([
      productModel.aggregate([
        {
          $facet: {
            totalProducts: [{ $count: "count" }],

            totalSales: [
              {
                $match: {
                  "sale_entry.date": { $ne: null },
                },
              },
              { $count: "count" },
            ],

            salesBySeller: [
              {
                $match: {
                  "sale_entry.seller_id": { $ne: null },
                  "sale_entry.date": { $ne: null },
                },
              },
              {
                $group: {
                  _id: "$sale_entry.seller_id",
                  salesCount: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "sellers",
                  localField: "_id",
                  foreignField: "_id",
                  as: "seller",
                },
              },
              {
                $unwind: {
                  path: "$seller",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 1,
                  salesCount: 1,
                  name: {
                    $ifNull: ["$seller.name", "Unknown Seller"],
                  },
                },
              },
              { $sort: { salesCount: -1 } },
            ],

            salesByProduct: [
              {
                $match: {
                  "sale_entry.date": { $ne: null },
                },
              },
              {
                $group: {
                  _id: "$name_id",
                  totalSold: { $sum: 1 },
                },
              },
              {
                $lookup: {
                  from: "productnames",
                  localField: "_id",
                  foreignField: "_id",
                  as: "product",
                },
              },
              {
                $unwind: {
                  path: "$product",
                  preserveNullAndEmptyArrays: true,
                },
              },
              {
                $project: {
                  _id: 0,
                  productId: "$_id",
                  productName: {
                    $ifNull: ["$product.name", "Unknown Product"],
                  },
                  totalSold: 1,
                },
              },
              {
                $sort: { totalSold: -1 },
              },
            ],
          },
        },
      ]),

      pharmacyModel.aggregate([
        {
          $lookup: {
            from: "products",
            let: { pharmacyNumber: "$pharmacyNumber" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$pharmacy_id", "$$pharmacyNumber"],
                  },
                },
              },
              {
                $project: {
                  sale_entry: 1,
                  name_id: 1,
                },
              },
            ],
            as: "products",
          },
        },

        {
          $addFields: {
            soldItems: {
              $filter: {
                input: "$products",
                as: "p",
                cond: {
                  $and: [
                    {
                      $ne: [
                        { $ifNull: ["$$p.sale_entry.seller_id", null] },
                        null,
                      ],
                    },
                    {
                      $ne: [{ $ifNull: ["$$p.sale_entry.date", null] }, null],
                    },
                  ],
                },
              },
            },
          },
        },

        {
          $addFields: {
            totalProducts: { $size: "$products" },
            soldProducts: { $size: "$soldItems" },
            leftProducts: {
              $subtract: [{ $size: "$products" }, { $size: "$soldItems" }],
            },
          },
        },

        {
          $unwind: {
            path: "$soldItems",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              pharmacyId: "$_id",
              name_id: "$soldItems.name_id",
            },
            pharmacyNumber: { $first: "$pharmacyNumber" },
            pharmacyName: { $first: "$name" },
            totalProducts: { $first: "$totalProducts" },
            soldProducts: { $first: "$soldProducts" },
            count: { $sum: 1 },
          },
        },

        {
          $sort: { count: -1 },
        },

        {
          $group: {
            _id: "$_id.pharmacyId",
            pharmacyNumber: { $first: "$pharmacyNumber" },
            pharmacyName: { $first: "$pharmacyName" },
            totalProducts: { $first: "$totalProducts" },
            soldProducts: { $first: "$soldProducts" },
            topProductId: { $first: "$_id.name_id" },
            topProductCount: { $first: "$count" },
          },
        },

        {
          $lookup: {
            from: "productnames",
            localField: "topProductId",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 1,
            pharmacyNumber: 1,
            pharmacyName: 1,
            totalProducts: 1,
            soldProducts: 1,
            leftProducts: 1,

            mostPopularProduct: {
              $ifNull: ["$product.name", "No Sales"],
            },

            mostPopularProductCount: {
              $ifNull: ["$topProductCount", 0],
            },
          },
        },

        {
          $sort: { soldProducts: -1 },
        },
      ]),

      pharmacyModel.countDocuments(),
      sellerModel.countDocuments(),
      productModel.aggregate([
        {
          $match: {
            "sale_entry.date": { $ne: null },
            "sale_entry.seller_id": { $ne: null },
          },
        },

        {
          $group: {
            _id: {
              sellerId: "$sale_entry.seller_id",
              productId: "$name_id",
            },
            count: { $sum: 1 },
          },
        },

        {
          $sort: { count: -1 },
        },

        {
          $group: {
            _id: "$_id.sellerId",
            topProductId: { $first: "$_id.productId" },
            topProductCount: { $first: "$count" },
          },
        },

        {
          $lookup: {
            from: "sellers",
            localField: "_id",
            foreignField: "_id",
            as: "seller",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: "productnames",
            localField: "topProductId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            sellerId: "$_id",

            sellerName: {
              $ifNull: ["$seller.name", "Unknown Seller"],
            },

            mostSoldProduct: {
              $ifNull: ["$product.name", "No Product"],
            },

            mostSoldProductCount: {
              $ifNull: ["$topProductCount", 0],
            },
          },
        },

        {
          $sort: { mostSoldProductCount: -1 },
        },
      ]),
    ]);

    const totalProducts = productStats[0]?.totalProducts?.[0]?.count || 0;
    const totalSales = productStats[0]?.totalSales?.[0]?.count || 0;
    const salesBySeller = productStats[0]?.salesBySeller || [];
    const salesByPharmacyData = salesByPharmacy || [];
    const salesByProduct = productStats[0]?.salesByProduct || [];

    res.json({
      success: true,
      data: {
        totals: {
          totalProducts,
          totalSales,
          pharmacyCount,
          sellerCount,
        },
        salesBySeller,
        salesByProduct,
        salesByPharmacy: salesByPharmacyData,
        topSalesBySeller: topSalesBySeller,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// API to get all products for manager view
const getAllProducts = async (req, res) => {
  console.log("getAllProducts - start");

  try {
    const isSoldExpr = {
      $and: [
        { $eq: [{ $type: "$sale_entry.date" }, "date"] },
        { $eq: [{ $type: "$sale_entry.seller_id" }, "objectId"] },
      ],
    };

    const [products, sellers, statsResult, categoryStats] = await Promise.all([
      productModel
        .find({
          $expr: isSoldExpr,
        })
        .sort({ _id: -1 })
        .limit(100)
        .select("-__v")
        .populate({
          path: "name_id",
          select: "name",
          model: "ProductName",
        })
        .populate({
          path: "sale_entry.seller_id",
          select: "name",
          model: "seller",
        })
        .lean(),

      sellerModel.find({}).select("_id name").lean(),

      productModel.aggregate([
        {
          $facet: {
            totalProducts: [{ $count: "count" }],

            soldProducts: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $ne: [{ $type: "$sale_entry" }, "missing"] },
                      { $eq: [{ $type: "$sale_entry.date" }, "date"] },
                      { $eq: [{ $type: "$sale_entry.seller_id" }, "objectId"] },
                    ],
                  },
                },
              },
              { $count: "count" },
            ],

            uniqueSellers: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $type: "$sale_entry.date" }, "date"] },
                      { $eq: [{ $type: "$sale_entry.seller_id" }, "objectId"] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: "$sale_entry.seller_id",
                },
              },
              { $count: "count" },
            ],

            uniquePharmacies: [
              {
                $group: {
                  _id: "$pharmacy_id",
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            totalProducts: {
              $ifNull: [{ $arrayElemAt: ["$totalProducts.count", 0] }, 0],
            },
            soldProducts: {
              $ifNull: [{ $arrayElemAt: ["$soldProducts.count", 0] }, 0],
            },
            sellersCount: {
              $ifNull: [{ $arrayElemAt: ["$uniqueSellers.count", 0] }, 0],
            },
            pharmaciesCount: {
              $ifNull: [{ $arrayElemAt: ["$uniquePharmacies.count", 0] }, 0],
            },
          },
        },
      ]),

      productModel.aggregate([
        {
          $project: {
            name_id: 1,

            isSold: {
              $cond: [
                {
                  $and: [
                    { $eq: [{ $type: "$sale_entry.date" }, "date"] },
                    { $eq: [{ $type: "$sale_entry.seller_id" }, "objectId"] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },

        {
          $group: {
            _id: "$name_id",
            total: { $sum: 1 },
            sold: { $sum: "$isSold" },
          },
        },

        {
          $lookup: {
            from: "productnames",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },

        {
          $unwind: {
            path: "$product",
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $project: {
            _id: 0,
            name_id: "$_id",
            name: {
              $ifNull: ["$product.name", "Unknown"],
            },
            total: 1,
            sold: 1,
            category: {
              $ifNull: ["$product.name", "Unknown"],
            },
          },
        },

        {
          $sort: { total: -1 },
        },
      ]),
    ]);

    const enrichedProducts = products.map((p) => ({
      ...p,
      product_name: p.name_id?.name || null,
      seller_name: p.sale_entry?.seller_id?.name || null,
    }));

    const sellerMap = {};
    sellers.forEach((s) => {
      sellerMap[s._id.toString()] = s.name;
    });

    const stats = statsResult[0] || {
      totalProducts: 0,
      soldProducts: 0,
      sellersCount: 0,
      pharmaciesCount: 0,
    };

    return res.json({
      success: true,
      products: {
        products: products,
        stats,
        categoryStats,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

// API to get product by id for manager view
const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({
        success: false,
        message: "Invalid product name id",
      });

    const objectId = new mongoose.Types.ObjectId(id);

    const isSoldExpr = {
      $and: [
        { $eq: [{ $type: "$sale_entry.date" }, "date"] },
        { $eq: [{ $type: "$sale_entry.seller_id" }, "objectId"] },
      ],
    };

    const [productName, stats, pharmacyStats, sellerStats] = await Promise.all([
      productNameModel.findById(id).select("-__v").lean(),

      productModel.aggregate([
        {
          $match: { name_id: objectId },
        },
        {
          $project: {
            name_id: 1,
            isSold: {
              $cond: [isSoldExpr, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$name_id",
            total: { $sum: 1 },
            sold: { $sum: "$isSold" },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            sold: 1,
          },
        },
      ]),

      productModel.aggregate([
        {
          $match: {
            name_id: objectId,
            pharmacy_id: { $ne: null },
          },
        },
        {
          $project: {
            pharmacy_id: 1,
            isSold: {
              $cond: [isSoldExpr, 1, 0],
            },
          },
        },
        {
          $group: {
            _id: "$pharmacy_id",
            total: { $sum: 1 },
            sold: { $sum: "$isSold" },
          },
        },
        {
          $lookup: {
            from: "pharmacies",
            localField: "_id",
            foreignField: "pharmacyNumber",
            as: "pharmacy",
          },
        },
        {
          $unwind: {
            path: "$pharmacy",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            pharmacy_id: "$_id",
            pharmacyName: "$pharmacy.name",
            pharmacyNumber: "$pharmacy.pharmacyNumber",
            total: 1,
            sold: 1,
          },
        },
        {
          $sort: { total: -1 },
        },
      ]),

      productModel.aggregate([
        {
          $match: {
            name_id: objectId,
            "sale_entry.seller_id": { $ne: null },
          },
        },
        {
          $project: {
            sale_entry: 1,
            isSold: {
              $cond: [isSoldExpr, 1, 0],
            },
          },
        },
        {
          $addFields: {
            seller_id_obj: {
              $toObjectId: "$sale_entry.seller_id",
            },
          },
        },
        {
          $group: {
            _id: "$seller_id_obj",
            totalSales: { $sum: "$isSold" },
          },
        },
        {
          $lookup: {
            from: "sellers",
            localField: "_id",
            foreignField: "_id",
            as: "seller",
          },
        },
        {
          $unwind: {
            path: "$seller",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "pharmacies",
            localField: "seller.location_id",
            foreignField: "pharmacyNumber",
            as: "pharmacy",
          },
        },
        {
          $unwind: {
            path: "$pharmacy",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            seller_id: "$_id",
            sellerName: "$seller.name",
            pharmacy: {
              _id: "$pharmacy._id",
              name: "$pharmacy.name",
              pharmacyNumber: "$pharmacy.pharmacyNumber",
            },
            totalSales: 1,
          },
        },
        {
          $sort: { totalSales: -1 },
        },
      ]),
    ]);

    if (!productName) {
      return res.status(404).json({
        success: false,
        message: "Product name not found",
      });
    }

    const result = stats[0] || {
      total: 0,
      sold: 0,
    };

    return res.json({
      success: true,
      product: {
        id: productName._id,
        name: productName.name,
        brief_description: productName.brief_description || null,
        description: productName.description || null,
        stats: result,
        pharmacies: pharmacyStats,
        sellers: sellerStats,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const addProducts = async (req, res) => {
  console.log("addProducts - start");

  try {
    const { pharmacy, product, date } = req.body;
    const requiredFields = { pharmacy, product, date };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0)
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);

    const filePath = req.file.path;
    const fileContent = await fs.readFile(filePath, "utf-8");
    const parsedData = fileContent
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((code) => ({ code }));

    const productsNames = await productNameModel
      .find({})
      .select("_id name")
      .lean();

    const pharmacies = await pharmacyModel
      .find({})
      .select("_id pharmacyNumber")
      .lean();

    const formattedDate = formatDate(date);

    const documents = parsedData.map((item) => ({
      name: productsNames.find((p) => p._id.toString() === product)?.name,
      name_id: product,
      stock_entry: {
        qr_code: `${formattedDate}_${item.code}`,
        date: new Date(date),
        employee_id: test_getRandomNumber(warehouse_employees) || null,
      },
      pharmacy_id: pharmacies.find((ph) => ph._id.toString() === pharmacy)
        ?.pharmacyNumber,
    }));

    const invalidDocs = documents.filter((doc) => {
      return (
        !doc.name ||
        !doc.name_id ||
        !doc.stock_entry?.qr_code ||
        !doc.pharmacy_id
      );
    });

    if (invalidDocs.length > 0) {
      console.log("First invalid doc:", invalidDocs[0]);

      throw new Error(
        `Invalid documents found (${invalidDocs.length}). Example missing fields detected.`,
      );
    }

    await productModel.insertMany(documents);

    return res.status(201).json({
      success: true,
      message: "Товары успешно добавлены!",
      inserted: documents.length,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductBySellerId = async (req, res) => {
  const { id } = req.params;
  try {
    // res.json({ success: true, product });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductsAddData = async (req, res) => {
  try {
    const pharmacies = await pharmacyModel
      .find({})
      .select("_id name pharmacyNumber")
      .sort({ pharmacyNumber: 1 })
      .lean();

    const productsNames = await productNameModel
      .find({})
      .select("_id name")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      pharmacies: pharmacies,
      productsNames: uniqueByName(productsNames),
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductByPharmacyId = async (req, res) => {
  const { id } = req.params;
  try {
    // res.json({ success: true, product });
  } catch (error) {
    handleServerError(res, error);
  }
};

// API to get all pharmacies with enriched data, including total sales and the number of current sellers for each pharmacy
const getAllPharmacies = async (req, res) => {
  console.log("getAllPharmacies - start");

  try {
    const pharmacies = await pharmacyModel
      .find({})
      .select("-__v -createdAt -updatedAt")
      .lean();

    const enrichedPharmacies = await Promise.all(
      pharmacies.map(async (pharmacy) => {
        const pharmacyNumber = Number(pharmacy.pharmacyNumber);

        const [total_products, sold, sellers] = await Promise.all([
          productModel.countDocuments({
            pharmacy_id: pharmacyNumber,
          }),

          productModel.countDocuments({
            pharmacy_id: pharmacyNumber,
            "sale_entry.date": { $ne: null },
            "sale_entry.seller_id": { $ne: null },
          }),

          sellerModel.countDocuments({
            location_id: pharmacyNumber,
            $or: [
              { "employmentPeriod.endDate": { $gt: new Date() } },
              { "employmentPeriod.endDate": null },
              { "employmentPeriod.endDate": { $exists: false } },
            ],
          }),
        ]);

        return {
          ...pharmacy,
          stats: {
            total_products,
            sold,
          },
          sellers,
        };
      }),
    );

    return res.status(200).json({
      success: true,
      pharmacies: enrichedPharmacies,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllPharmacies_addSeller = async (req, res) => {
  console.log("getAllPharmacies_addSeller - start");
  try {
    const pharmacies = await pharmacyModel
      .find({})
      .select("_id name pharmacyNumber")
      .lean();

    res.status(200).json({ success: true, pharmacies });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getPharmacyById = async (req, res) => {
  console.log("getPharmacyById - start");
  const { id } = req.params;

  try {
    const isObjectId = id.length === 24 && /^[0-9a-fA-F]+$/.test(id);
    const query = isObjectId ? { _id: id } : { pharmacyNumber: Number(id) };

    const pharmacy = await pharmacyModel
      .findOne(query)
      .select("-__v -createdAt -updatedAt")
      .lean();

    if (!pharmacy)
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });

    const pharmacyNumber = Number(pharmacy.pharmacyNumber);

    const [products, sellers] = await Promise.all([
      productModel
        .find({
          pharmacy_id: pharmacyNumber,
        })
        .select("name_id sale_entry")
        .populate({
          path: "name_id",
          select: "name",
          model: "ProductName",
        })
        .lean(),

      sellerModel
        .find({
          location_id: pharmacyNumber,
        })
        .select("-__v -createdAt -updatedAt")
        .lean(),
    ]);

    const productMap = new Map();
    const sellerSalesMap = new Map();

    products.forEach((product) => {
      const key = product.name_id?._id?.toString();
      if (!key) return;

      if (!productMap.has(key)) {
        productMap.set(key, {
          _id: product.name_id._id,
          name: product.name_id.name,
          total: 0,
          sold: 0,
        });
      }

      const entry = productMap.get(key);
      entry.total += 1;

      const isSold = product.sale_entry?.date && product.sale_entry?.seller_id;

      if (isSold) {
        entry.sold += 1;
        const sellerId = product.sale_entry.seller_id?.toString();

        if (sellerId)
          sellerSalesMap.set(sellerId, (sellerSalesMap.get(sellerId) || 0) + 1);
      }
    });

    const productStats = Array.from(productMap.values());

    const enrichedSellers = sellers.map((seller) => {
      const sellerKey = seller._id?.toString();

      return {
        ...seller,
        soldProducts: sellerSalesMap.get(sellerKey) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      pharmacy: {
        ...pharmacy,
        stats: productStats,
        sellers: {
          total: sellers.length,
          items: enrichedSellers,
        },
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getPharmacyBySellerId = async (req, res) => {
  const { id } = req.params;
  try {
    // res.json({ success: true, pharmacy });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllSellers = async (req, res) => {
  console.log("getAllSellers - start");

  try {
    const [sellers, pharmacyCount, totalProducts, counts] = await Promise.all([
      sellerModel.find({}).select("-__v -telegram_id -phone").lean(),
      pharmacyModel.countDocuments(),
      productModel.countDocuments(),
      productModel.aggregate([
        {
          $match: {
            "sale_entry.seller_id": { $ne: null },
            "sale_entry.date": { $ne: null },
          },
        },
        {
          $group: {
            _id: "$sale_entry.seller_id",
            totalSoldProducts: { $sum: 1 },
          },
        },
      ]),
    ]);

    const salesMap = new Map();

    counts.forEach((c) => {
      if (!c._id) return;
      salesMap.set(c._id.toString(), c.totalSoldProducts);
    });

    const sellersWithSales = sellers.map((seller) => ({
      ...seller,
      totalSoldProducts: salesMap.get(seller._id.toString()) || 0,
    }));

    const totalSoldProducts = counts.reduce(
      (sum, c) => sum + (c.totalSoldProducts || 0),
      0,
    );

    return res.json({
      success: true,
      sellers: sellersWithSales,
      sellersNumber: sellers.length,
      pharmacyCount,
      totalProducts,
      totalSoldProducts,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getSellerById = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await sellerModel.findById(id).select("-__v").lean();

    if (!seller)
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });

    const sellerObjectId = seller._id;

    const pharmacyQuery = pharmacyModel
      .findOne({ pharmacyNumber: seller.location_id })
      .select("name -_id")
      .lean();

    const statsQuery = productModel.aggregate([
      {
        $match: {
          pharmacy_id: seller.location_id,
        },
      },

      {
        $group: {
          _id: null,

          totalProducts: { $sum: 1 },

          salesCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sale_entry.seller_id", sellerObjectId] },
                    { $ne: ["$sale_entry.date", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalProducts: 1,
          salesCount: 1,
        },
      },
    ]);

    const categoriesQuery = productModel.aggregate([
      {
        $match: {
          pharmacy_id: seller.location_id,
        },
      },

      {
        $group: {
          _id: "$name_id",
          total: { $sum: 1 },

          sold: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sale_entry.seller_id", sellerObjectId] },
                    { $ne: ["$sale_entry.date", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },

      {
        $addFields: {
          soldPercent: {
            $cond: [
              { $eq: ["$total", 0] },
              0,
              { $divide: ["$sold", "$total"] },
            ],
          },
        },
      },

      {
        $lookup: {
          from: "productnames",
          localField: "_id",
          foreignField: "_id",
          as: "productName",
        },
      },

      {
        $unwind: {
          path: "$productName",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          _id: 0,
          name: "$productName.name",
          total: 1,
          sold: 1,
          soldPercent: 1,
        },
      },

      {
        $sort: {
          soldPercent: -1,
          sold: -1,
          total: -1,
        },
      },
    ]);

    const [pharmacy, stats, categories] = await Promise.all([
      pharmacyQuery,
      statsQuery,
      categoriesQuery,
    ]);

    const sellerStats = stats[0] || {
      totalProducts: 0,
      salesCount: 0,
    };

    return res.json({
      success: true,
      seller: {
        ...seller,
        pharmacy_name: pharmacy?.name || null,
        ...sellerStats,
        categories,
      },
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const addSeller = async (req, res) => {
  console.log("addSeller - start");

  const { name, dob, employmentPeriod, location_id, telegram_id, phone } =
    req.body;

  if (
    !name?.name ||
    !name?.surname ||
    !employmentPeriod?.startDate ||
    !location_id
  )
    return res.status(400).json({
      success: false,
      message: "Заполните все обязательные поля!",
    });

  try {
    const sellers = await sellerModel
      .find({})
      .select("telegram_id phone -_id")
      .lean();

    const telegramIds = sellers.map((s) => s.telegram_id);
    const phones = sellers.map((s) => s.phone);

    let finalTelegramId;

    if (telegram_id) {
      const parsedId = Number(telegram_id);

      if (telegramIds.includes(parsedId))
        return res.status(400).json({
          success: false,
          message: "Telegram ID уже существует",
        });

      finalTelegramId = parsedId;
    } else {
      finalTelegramId = getRandomTelegramId(telegramIds);
    }

    let finalPhone;

    if (phone) {
      if (phones.includes(phone))
        return res.status(400).json({
          success: false,
          message: "Телефон уже существует",
        });

      finalPhone = phone;
    } else {
      let generatedPhone;

      do {
        generatedPhone = generateRandomPhone();
      } while (phones.includes(generatedPhone));

      finalPhone = generatedPhone;
    }

    const seller = await sellerModel.create({
      name,
      dob: dob || null,
      employmentPeriod,
      location_id: Number(location_id),
      telegram_id: finalTelegramId,
      phone: finalPhone,
    });

    res.status(201).json({ success: true, seller });
  } catch (error) {
    handleServerError(res, error);
  }
};

const updateSeller = (req, res) => {
  const { id } = req.params;
  const { name, telegram_user_id } = req.body;
};

const deleteSeller = (req, res) => {
  const { id } = req.params;
};

const getAllManagers = async (req, res) => {
  console.log("getAllManagers - start");
  try {
    const managers = await managerModel
      .find({})
      .select("-__v -telegram_id")
      .lean();

    const sortedManagers = [...managers].sort((a, b) => {
      const nameA = a.name.surname + a.name.name + a.name.patronymic;
      const nameB = b.name.surname + b.name.name + b.name.patronymic;
      return nameA.localeCompare(nameB, "ru");
    });

    console.log(`getAllManagers - managers found: ${sortedManagers.length}`);
    res.json({ success: true, managers: sortedManagers });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllAdmins = async (req, res) => {
  console.log("getAllAdmins - start");
  try {
    const admins = await adminModel
      .find({})
      .select("-__v -employmentPeriod.startDate -employmentPeriod.endDate")
      .lean();

    const sortedAdmins = [...admins].sort((a, b) => {
      const nameA = a.name.surname + a.name.name + a.name.patronymic;
      const nameB = b.name.surname + b.name.name + b.name.patronymic;
      return nameA.localeCompare(nameB, "ru");
    });

    console.log(`getAllAdmins - admins found: ${sortedAdmins.length}`);
    res.json({ success: true, admins: sortedAdmins });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllConflicts = async (req, res) => {
  console.log("getAllConflicts - start");

  try {
    const result = await issueLogModel.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "productnames",
          localField: "product.name_id",
          foreignField: "_id",
          as: "productName",
        },
      },
      {
        $unwind: {
          path: "$productName",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "sellers",
          localField: "telegram_id",
          foreignField: "telegram_id",
          as: "seller",
        },
      },
      {
        $unwind: {
          path: "$seller",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          productName: "$productName.name",
          seller: {
            name: "$seller.name",
            telegram_id: "$seller.telegram_id",
          },
        },
      },
      {
        $project: {
          __v: 0,
          product: 0,
          productName: 0,
        },
      },
      {
        $facet: {
          data: [{ $sort: { date: -1 } }],
          stats: [
            {
              $group: {
                _id: null,
                totalConflicts: { $sum: 1 },
                uniqueSellers: { $addToSet: "$telegram_id" },
              },
            },
            {
              $project: {
                _id: 0,
                totalConflicts: 1,
                uniqueSellersCount: { $size: "$uniqueSellers" },
              },
            },
          ],
        },
      },
    ]);

    const conflicts = result[0].data;
    const stats = result[0].stats[0] || {
      totalConflicts: 0,
      uniqueSellersCount: 0,
    };

    console.log(
      `getAllConflicts - conflicts: ${stats.totalConflicts}, unique sellers: ${stats.uniqueSellersCount}`,
    );

    res.json({
      success: true,
      conflicts,
      totalConflicts: stats.totalConflicts,
      uniqueSellers: stats.uniqueSellersCount,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export {
  getAllProducts,
  getProductById,
  getAllPharmacies,
  getPharmacyById,
  getAllSellers,
  getSellerById,
  addSeller,
  updateSeller,
  deleteSeller,
  getAllPharmacies_addSeller,
  getAllManagers,
  getAllAdmins,
  getProductsAddData,
  addProducts,
  getDashboardData,
  getAllConflicts,
};
