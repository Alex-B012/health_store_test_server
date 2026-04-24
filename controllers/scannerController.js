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

const scanProduct = async (req, res) => {
  console.log("scanProduct - start:");

  try {
    const { scannerData } = req.body;
    const { telegramUser } = req;
    const qr_code = scannerData?.[0]?.text;

    if (!qr_code)
      return res.status(400).json({
        success: false,
        message: "Invalid QR code",
      });

    const product = await productModel.findOne({
      "stock_entry.qr_code": qr_code,
    });

    console.log("product:", product);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    if (product.sale_entry && product.sale_entry.date) {
      await issueLogModel.create({
        date: new Date(),
        product_id: product._id,
        telegram_id: telegramUser.id,
      });

      return res.status(409).json({
        success: false,
        message: "QR code already assigned to this product",
      });
    }

    const seller = await sellerModel.findOne({
      telegram_id: telegramUser.id,
    });

    const saleEntry = {
      date: scannerData.date ? new Date(scannerData.date) : new Date(),
      seller_id: seller._id,
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

export { scanProduct };
