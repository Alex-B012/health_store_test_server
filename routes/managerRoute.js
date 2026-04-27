import express from "express";
import multer from "multer";
import {
  getDashboardData,
  getAllProducts,
  getProductById,
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
  getAllConflicts,
} from "../controllers/managerController.js";

import telegramAuth from "../bot/telegramAuth.js";
import { requireRole } from "../middlewares/authUser.js";

const managerRouter = express.Router();
const upload = multer({ dest: "uploads/" });

managerRouter.get(
  "/dashboard",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getDashboardData,
);

managerRouter.get(
  "/products",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllProducts,
);

managerRouter.get(
  "/products/:id",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getProductById,
);

managerRouter.post(
  "/products",
  upload.single("file"),
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  addProducts,
);

managerRouter.get(
  "/products-add-data",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getProductsAddData,
);

managerRouter.get(
  "/sellers",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllSellers,
);

managerRouter.get(
  "/sellers/:id",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getSellerById,
);
managerRouter.post(
  "/seller",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  addSeller,
);
managerRouter.get(
  "/pharmacies",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllPharmacies,
);
managerRouter.get(
  "/pharmacies/:id",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getPharmacyById,
);
managerRouter.get(
  "/pharmacies-add-seller",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllPharmacies_addSeller,
);
managerRouter.get(
  "/managers",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllManagers,
);
managerRouter.get(
  "/admins",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllAdmins,
);
managerRouter.get(
  "/conflicts",
  // telegramAuth(),
  // requireRole(["manager", "admin"]),
  getAllConflicts,
);

export default managerRouter;
