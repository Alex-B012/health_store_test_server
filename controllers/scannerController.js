import { pharmacies_codes, warehouse_employees } from "../data/data.js";
import productModel from "../models/productModel.js";
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

    console.log("scannerData - received:", scannerData);

    const qr_code = test_generateQrCode(scannerData.text);

    const createProductForTest = async () => {
      return {
        name: test_generateProductName() || "Unnamed Product",
        stock_entry: {
          qr_code: qr_code || null,
          date: test_getRandomStockDate() || null,
          employee_id: test_getRandomNumber(warehouse_employees) || null,
        },
        pharmacy_id: test_getRandomNumber(pharmacies_codes) || null,
        sale_entry: {
          qr_code: qr_code || null,
          date: scannerData.date ? new Date(scannerData.date) : new Date(),
          seller_id: (await test_getRandomSellerId()) || null,
        },
      };
    };

    const productData = await createProductForTest();

    const newProduct = new productModel(productData);
    await newProduct.save();

    console.log(
      "Scanner data saved to database (mocked) - logic to be implemented",
    );

    res.json({ success: true, message: "Scanner data delivered" });
  } catch (error) {
    handleServerError(res, error);
  }
};

export { scanProduct };
