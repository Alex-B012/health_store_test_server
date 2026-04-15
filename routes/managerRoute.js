import express from "express";
import multer from "multer";
import {
  getDashboardData,
  getAllProducts,
  getAllSellers,
  getAllPharmacies,
  getPharmacyById,
  addSeller,
  getAllPharmacies_addSeller,
  getAllManagers,
  getAllAdmins,
  getProductsAddData,
  addProducts,
  getSellerById,
} from "../controllers/managerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const managerRouter = express.Router();
const upload = multer({ dest: "uploads/" });

// managerRouter.get("/products", authUser(getSellersArray), getAllProducts);
managerRouter.get("/dashboard", getDashboardData);
managerRouter.get("/products", getAllProducts);
managerRouter.post("/products", upload.single("file"), addProducts);
managerRouter.get("/products-add-data", getProductsAddData);
managerRouter.get("/sellers", getAllSellers);
managerRouter.get("/sellers/:id", getSellerById);
managerRouter.post("/seller", addSeller);
managerRouter.get("/pharmacies", getAllPharmacies);
managerRouter.get("/pharmacies/:id", getPharmacyById);
managerRouter.get("/pharmacies-add-seller", getAllPharmacies_addSeller);
managerRouter.get("/managers", getAllManagers);
managerRouter.get("/admins", getAllAdmins);

export default managerRouter;
