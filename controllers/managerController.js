import fs from "fs/promises";
import mongoose from "mongoose";

import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import pharmacyModel from "../models/pharmacyModel.js";
import productModel from "../models/productModel.js";
import productNameModel from "../models/productNameModel.js";
import sellerModel from "../models/sellerModel.js";

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
    const [productStats, salesByPharmacy, pharmacyCount, sellerCount] =
      await Promise.all([
        productModel.aggregate([
          {
            $facet: {
              totalProducts: [{ $count: "count" }],

              totalSales: [
                {
                  $match: {
                    "sale_entry.qr_code": { $exists: true, $ne: null, $ne: "" },
                  },
                },
                { $count: "count" },
              ],

              salesBySeller: [
                {
                  $match: {
                    "sale_entry.seller_id": { $exists: true, $ne: null },
                    "sale_entry.qr_code": { $exists: true, $ne: null, $ne: "" },
                  },
                },
                {
                  $group: {
                    _id: "$sale_entry.seller_id",
                    salesCount: { $sum: 1 },
                  },
                },
                {
                  $addFields: {
                    sellerObjectId: {
                      $cond: [
                        { $eq: [{ $type: "$_id" }, "string"] },
                        { $toObjectId: "$_id" },
                        "$_id",
                      ],
                    },
                  },
                },
                {
                  $lookup: {
                    from: "sellers",
                    localField: "sellerObjectId",
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
                    name: { $ifNull: ["$seller.name", "Unknown Seller"] },
                  },
                },
                { $sort: { salesCount: -1 } },
              ],
            },
          },
        ]),

        pharmacyModel.aggregate([
          {
            $lookup: {
              from: "products",
              localField: "pharmacyNumber",
              foreignField: "pharmacy_id",
              as: "soldProducts",
            },
          },
          {
            $addFields: {
              productsSold: {
                $size: {
                  $filter: {
                    input: "$soldProducts",
                    as: "p",
                    cond: {
                      $and: [
                        { $ne: ["$$p.sale_entry.qr_code", null] },
                        { $ne: ["$$p.sale_entry.qr_code", ""] },
                        { $ifNull: ["$$p.sale_entry.qr_code", false] },
                      ],
                    },
                  },
                },
              },
            },
          },
          {
            $project: {
              _id: 1,
              pharmacyNumber: "$pharmacyNumber",
              pharmacyName: "$name",
              productsSold: 1,
            },
          },
          { $sort: { productsSold: -1 } },
        ]),

        pharmacyModel.countDocuments(),
        sellerModel.countDocuments(),
      ]);

    const totalProducts = productStats[0]?.totalProducts?.[0]?.count || 0;
    const totalSales = productStats[0]?.totalSales?.[0]?.count || 0;
    const salesBySeller = productStats[0]?.salesBySeller || [];
    const salesByPharmacyData = salesByPharmacy || [];

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
        salesByPharmacy: salesByPharmacyData,
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
    const products = await productModel
      .find({
        "sale_entry.qr_code": {
          $exists: true,
          $ne: null,
          $ne: "",
        },
      })
      .sort({ _id: -1 })
      .limit(100)
      .select("-__v")
      .lean();

    const sellers = await sellerModel.find({}).select("_id name").lean();

    const sellerMap = {};
    sellers.forEach((s) => {
      sellerMap[s._id.toString()] = s.name;
    });

    const enrichedProducts = products.map((p) => {
      const sale = p.sale_entry || {};

      return {
        ...p,
        sale_entry: {
          ...sale,
          seller_name: sale.seller_id
            ? sellerMap[sale.seller_id] || null
            : null,
        },
      };
    });

    const statsResult = await productModel.aggregate([
      {
        $group: {
          _id: null,

          totalProducts: {
            $sum: {
              $cond: [{ $ne: ["$sale_entry.seller_id", null] }, 1, 0],
            },
          },

          salesCount: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $ifNull: ["$sale_entry.qr_code", ""],
                      },
                    },
                    0,
                  ],
                },
                1,
                0,
              ],
            },
          },

          uniqueSellers: {
            $addToSet: "$sale_entry.seller_id",
          },

          uniquePharmacies: {
            $addToSet: "$pharmacy_id",
          },
        },
      },

      {
        $project: {
          _id: 0,
          totalProducts: 1,
          salesCount: 1,
          sellersCount: { $size: "$uniqueSellers" },
          pharmaciesCount: { $size: "$uniquePharmacies" },
        },
      },
    ]);

    const stats = statsResult[0] || {
      totalProducts: 0,
      soldProducts: 0,
      sellersCount: 0,
      pharmaciesCount: 0,
    };

    const categoryStats = await productModel.aggregate([
      {
        $group: {
          _id: "$name_id",
          name: { $first: "$name" },
          total: { $sum: 1 },

          sold: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    { $strLenCP: { $ifNull: ["$sale_entry.qr_code", ""] } },
                    0,
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
          _id: 1,
          category: "$name",
          total: 1,
          sold: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.json({
      success: true,
      products: {
        products: enrichedProducts,
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

    const productName = await productNameModel.findById(id).lean();

    if (!productName)
      return res.status(404).json({
        success: false,
        message: "Product name not found",
      });

    const stats = await productModel.aggregate([
      {
        $match: {
          name_id: new mongoose.Types.ObjectId(id),
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
                  $gt: [
                    { $strLenCP: { $ifNull: ["$sale_entry.qr_code", ""] } },
                    0,
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
          name_id: "$_id",
          total: 1,
          sold: 1,
        },
      },
    ]);

    const pharmacyStats = await productModel.aggregate([
      {
        $match: {
          name_id: new mongoose.Types.ObjectId(id),
          pharmacy_id: { $ne: null },
        },
      },

      {
        $group: {
          _id: "$pharmacy_id",
          total: { $sum: 1 },

          sold: {
            $sum: {
              $cond: [
                {
                  $gt: [
                    {
                      $strLenCP: {
                        $ifNull: ["$sale_entry.qr_code", ""],
                      },
                    },
                    0,
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
    ]);

    const result = stats[0] || {
      name_id: id,
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
        stats: {
          total: result.total,
          sold: result.sold,
        },
        pharmacies: pharmacyStats,
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrichedPharmacies = await Promise.all(
      pharmacies.map(async (pharmacy) => {
        const pharmacyNumber = Number(pharmacy.pharmacyNumber);

        const [total_products, sold, sellers] = await Promise.all([
          productModel.countDocuments({
            pharmacy_id: pharmacyNumber,
            "stock_entry.qr_code": { $exists: true, $ne: "" },
          }),

          productModel.countDocuments({
            pharmacy_id: pharmacyNumber,
            "sale_entry.qr_code": { $exists: true, $ne: "" },
          }),

          sellerModel.countDocuments({
            location_id: pharmacyNumber,
            $or: [
              { "employmentPeriod.endDate": { $gt: today } },
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
  console.log("getAllSellers_addSeller - start");
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pharmacyNumber = Number(pharmacy.pharmacyNumber);

    const products = await productModel
      .find({
        pharmacy_id: pharmacyNumber,
        "stock_entry.qr_code": { $exists: true, $ne: "" },
      })
      .select("name name_id sale_entry")
      .lean();

    const map = new Map();

    products.forEach((product) => {
      const key = product.name_id?.toString();
      if (!key) return;

      if (!map.has(key))
        map.set(key, {
          name: product.name,
          total: 0,
          sold: 0,
        });

      const entry = map.get(key);

      entry.total += 1;

      if (product.sale_entry?.qr_code) entry.sold += 1;
    });

    const productStats = Array.from(map.values());

    const sellers = await sellerModel.countDocuments({
      location_id: pharmacyNumber,
      $or: [
        { "employmentPeriod.endDate": { $gt: today } },
        { "employmentPeriod.endDate": null },
        { "employmentPeriod.endDate": { $exists: false } },
      ],
    });

    return res.status(200).json({
      success: true,
      pharmacy: {
        ...pharmacy,
        stats: productStats,
        sellers,
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
            "sale_entry.seller_id": { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$sale_entry.seller_id",
            salesCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ifNull: ["$sale_entry.qr_code", false] },
                      { $ne: ["$sale_entry.qr_code", ""] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    const countSalesMap = new Map();

    counts.forEach((c) => {
      countSalesMap.set(c._id.toString(), c.salesCount);
    });

    const sellersWithSales = sellers.map((seller) => ({
      ...seller,
      salesCount: countSalesMap.get(seller._id.toString()) || 0,
    }));

    res.json({
      success: true,
      sellers: sellersWithSales,
      sellersNumber: sellers.length,
      pharmacyCount,
      totalProducts,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getSellerById = async (req, res) => {
  const { id } = req.params;

  try {
    const seller = await sellerModel.findById(id).select("-__v").lean();

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const pharmacyName =
      (
        await pharmacyModel
          .findOne({ pharmacyNumber: seller.location_id })
          .select("name -_id")
          .lean()
      )?.name || null;

    const stats = await productModel.aggregate([
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
                    { $eq: ["$sale_entry.seller_id", id] },
                    { $ifNull: ["$sale_entry.qr_code", false] },
                    { $ne: ["$sale_entry.qr_code", ""] },
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

    const sellerStats = stats[0] || {
      totalProducts: 0,
      salesCount: 0,
    };

    const categories = await productModel.aggregate([
      {
        $match: {
          pharmacy_id: seller.location_id,
        },
      },
      {
        $group: {
          _id: "$name",

          total: { $sum: 1 },

          sold: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$sale_entry.seller_id", id] },
                    { $ifNull: ["$sale_entry.qr_code", false] },
                    { $ne: ["$sale_entry.qr_code", ""] },
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
          name: "$_id",
          total: 1,
          sold: 1,
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    res.json({
      success: true,
      seller: {
        ...seller,
        pharmacy_name: pharmacyName,
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
  ) {
    return res.status(400).json({
      success: false,
      message: "Заполните все обязательные поля!",
    });
  }

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

      if (telegramIds.includes(parsedId)) {
        return res.status(400).json({
          success: false,
          message: "Telegram ID уже существует",
        });
      }

      finalTelegramId = parsedId;
    } else {
      finalTelegramId = getRandomTelegramId(telegramIds);
    }

    let finalPhone;

    if (phone) {
      if (phones.includes(phone)) {
        return res.status(400).json({
          success: false,
          message: "Телефон уже существует",
        });
      }

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
};
