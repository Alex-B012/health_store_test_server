import { getRandomTelegramId } from "../db_service/db_utils.js";
import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import pharmacyModel from "../models/pharmacyModel.js";
import productModel from "../models/productModel.js";
import sellerModel from "../models/sellerModel.js";
import { handleServerError } from "../utils/utils.js";

// API to get all products for manager view
const getAllProducts = async (req, res) => {
  console.log("getAllProducts - start");

  try {
    const products = await productModel
      .find({})
      .select("-__v -stock_entry")
      .lean();
    const sellers = await sellerModel.find({}).select("_id name").lean();

    const sellerMap = {};
    sellers.forEach((s) => {
      sellerMap[s._id.toString()] = s.name;
    });

    const enrichedProducts = products.map((p) => {
      const sale = { ...p.sale_entry };
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

    console.log(`getAllProducts - products found: ${enrichedProducts.length}`);
    res.json({ success: true, products: enrichedProducts });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    // const product = await productModel.findById(id);
    // if (!product) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Product not found" });
    // }
    // res.json({ success: true, product });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductBySellerId = async (req, res) => {
  const { id } = req.params;
  try {
    // const product = await productModel.findOne({ sellerId: id });
    // if (!product) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Product not found" });
    // }
    // res.json({ success: true, product });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getProductByPharmacyId = async (req, res) => {
  const { id } = req.params;
  try {
    // const product = await productModel.findOne({ pharmacyId: id });
    // if (!product) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Product not found" });
    // }
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
      .select("-__v, -createdAt, -updatedAt")
      .lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const enrichedPharmacies = await Promise.all(
      pharmacies.map(async (pharmacy) => {
        const pharmacyNumber = Number(pharmacy.pharmacyNumber);

        const sales = await productModel.countDocuments({
          pharmacy_id: pharmacyNumber,
          "sale_entry.qr_code": { $exists: true, $ne: "" },
        });

        const sellers = await sellerModel.countDocuments({
          location_id: pharmacyNumber,
          $or: [
            { "employmentPeriod.endDate": { $gt: today } },
            { "employmentPeriod.endDate": null },
            { "employmentPeriod.endDate": { $exists: false } },
          ],
        });

        return {
          ...pharmacy,
          sales,
          sellers,
        };
      }),
    );

    res.status(200).json({ success: true, pharmacies: enrichedPharmacies });
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
    // const pharmacy = await pharmacyModel.findById(id);
    // if (!pharmacy) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Pharmacy not found" });
    // }
    // res.json({ success: true, pharmacy });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getPharmacyBySellerId = async (req, res) => {
  const { id } = req.params;
  try {
    // const pharmacy = await pharmacyModel.findOne({ sellerId: id });
    // if (!pharmacy) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Pharmacy not found" });
    // }
    // res.json({ success: true, pharmacy });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getAllSellers = async (req, res) => {
  console.log("getAllSellers - start");
  try {
    const sellers = await sellerModel
      .find({})
      .select("-__v -telegram_id")
      .lean();

    const counts = await productModel.aggregate([
      {
        $match: {
          "sale_entry.seller_id": { $ne: null },
        },
      },
      {
        $group: {
          _id: "$sale_entry.seller_id",
          salesCount: { $sum: 1 },
        },
      },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.salesCount;
    });

    const sellersWithSales = sellers.map((seller) => ({
      ...seller,
      salesCount: countMap[seller._id.toString()] || 0,
    }));

    res.json({ success: true, sellers: sellersWithSales });
  } catch (error) {
    handleServerError(res, error);
  }
};

const getSellerById = async (req, res) => {
  const { id } = req.params;
  try {
    // const seller = await sellerModel.findById(id);
    // if (!seller) {
    //   return res
    //     .status(404)
    //     .json({ success: false, message: "Seller not found" });
    // }
    // res.json({ success: true, seller });
  } catch (error) {
    handleServerError(res, error);
  }
};

const addSeller = async (req, res) => {
  console.log("addSeller - start");

  const { name, dob, employmentPeriod, location_id, telegram_id } = req.body;

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
      .select("telegram_id -_id")
      .lean();

    const telegramIds = sellers.map((s) => s.telegram_id);

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

    const seller = await sellerModel.create({
      name,
      dob: dob || null,
      employmentPeriod,
      location_id: Number(location_id),
      telegram_id: finalTelegramId,
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
};
