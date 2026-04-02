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

const getAllPharmacies = async (req, res) => {
  try {
    // const pharmacies = await pharmacyModel.find({});
    // res.json({ success: true, pharmacies });
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
  const { name, telegram_user_id } = req.body;
  try {
    // const seller = await sellerModel.create({ name, telegram_user_id });
    // res.status(201).json({ success: true, seller });
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
};
