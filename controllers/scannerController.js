import { pharmacies_codes, warehouse_employees } from "../data/data.js";
import issueLogModel from "../models/issueLogModel.js";
import productModel from "../models/productModel.js";
import sellerModel from "../models/sellerModel.js";
import {
  test_generateProductName,
  test_generateQrCode,
  test_getRandomNumber,
  test_getRandomSellerId,
  test_getRandomStockDate,
} from "../utils/tests.js";
import { handleServerError } from "../utils/utils.js";

const EXCLUDED_DATA = "-__v -date -createdAt -updatedAt";
const EXCLUDED_DATA_V = "-__v";

const scanProduct = async (req, res) => {
  console.log("scanProduct - start:");

  try {
    const { scannerData } = req.body;
    const { telegramUser } = req;
    const qr_code = scannerData?.[0]?.text;

    console.log("scannerData", scannerData);

    if (!qr_code)
      return res.status(400).json({
        success: false,
        message: "Invalid QR code",
      });

    const product = await productModel.findOne({
      "stock_entry.qr_code": qr_code,
    });

    console.log("product:", product);
    console.log("telegramUser:", telegramUser);

    if (!product) {
      await issueLogModel.create({
        date: new Date(),
        telegram_id: telegramUser.id,
        comment: "Отсканирован неизвестный QR-код",
      });

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.sale_entry && product.sale_entry.date) {
      await issueLogModel.create({
        date: new Date(),
        product_id: product._id,
        telegram_id: telegramUser.id,
        comment: "QR-код отсканирован повторно",
      });

      return res.status(409).json({
        success: false,
        message: "QR code already assigned to this product",
      });
    }

    const seller = await sellerModel
      .findOne({
        telegram_id: Number(telegramUser.id),
      })
      .select(EXCLUDED_DATA_V);

    console.log("seller:", seller);

    if (seller.location_id !== product.pharmacy_id) {
      await issueLogModel.create({
        date: new Date(),
        product_id: product._id,
        telegram_id: telegramUser.id,
        comment: "QR-код принадлежит другой аптеке",
      });

      return res.status(400).json({
        success: false,
        message: "Invalid QR code - pharmacy",
      });
    }

    const saleEntry = {
      date: scannerData.date ? new Date(scannerData.date) : new Date(),
      seller_id: seller.id,
    };

    product.sale_entry = saleEntry;
    await product.save();

    console.log("Sale entry added to product:", product._id);

    return res.json({
      success: true,
      message: "Sale entry recorded",
      data: product,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProfile = async (req, res) => {
  console.log("getProfile - start:");

  try {
    const { telegramUser } = req;

    const result = await sellerModel.aggregate([
      {
        $match: {
          telegram_id: telegramUser.id,
        },
      },
      {
        $lookup: {
          from: "pharmacies",
          localField: "location_id",
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
        $lookup: {
          from: "products",
          let: { sellerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$sale_entry.seller_id", "$$sellerId"],
                },
              },
            },
            {
              $facet: {
                totalCount: [{ $count: "count" }],
                latestSales: [
                  { $sort: { "sale_entry.date": -1 } },
                  { $limit: 100 },

                  {
                    $lookup: {
                      from: "productnames",
                      localField: "name_id",
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
                    $addFields: {
                      name: "$productName.name",
                    },
                  },
                  {
                    $project: {
                      productName: 0,
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                totalSales: {
                  $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
                },
              },
            },
            {
              $project: {
                latestSales: 1,
                totalSales: 1,
              },
            },
          ],
          as: "products",
        },
      },
      {
        $addFields: {
          pharmacyName: { $ifNull: ["$pharmacy.name", null] },
        },
      },
      {
        $project: {
          __v: 0,
          dob: 0,
          employmentPeriod: 0,
          telegram_id: 0,
          pharmacy: 0,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const seller = result[0];

    seller.totalSales = seller.products?.[0]?.totalSales || 0;
    seller.products = seller.products?.[0]?.latestSales || [];

    return res.json({
      success: true,
      message: "Seller found",
      profile: seller,
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

export { scanProduct, getProfile };
