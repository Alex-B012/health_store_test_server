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

const useAuth = process.env.USE_AUTH === "true";

console.log();

const withAuth = (roles = []) => {
  if (!useAuth) return [];
  return [telegramAuth(), requireRole(roles)];
};

managerRouter.get(
  "/dashboard",
  ...withAuth(["manager", "admin"]),
  getDashboardData,
);

managerRouter.get(
  "/products",
  ...withAuth(["manager", "admin"]),
  getAllProducts,
);

managerRouter.get(
  "/products/:id",
  ...withAuth(["manager", "admin"]),
  getProductById,
);

managerRouter.post(
  "/products",
  upload.single("file"),
  ...withAuth(["manager", "admin"]),
  addProducts,
);

managerRouter.get(
  "/products-add-data",
  ...withAuth(["manager", "admin"]),
  getProductsAddData,
);

managerRouter.get("/sellers", ...withAuth(["manager", "admin"]), getAllSellers);

managerRouter.get(
  "/sellers/:id",
  ...withAuth(["manager", "admin"]),
  getSellerById,
);
managerRouter.post("/seller", ...withAuth(["manager", "admin"]), addSeller);
managerRouter.get(
  "/pharmacies",
  ...withAuth(["manager", "admin"]),
  getAllPharmacies,
);
managerRouter.get(
  "/pharmacies/:id",
  ...withAuth(["manager", "admin"]),
  getPharmacyById,
);
managerRouter.get(
  "/pharmacies-add-seller",
  ...withAuth(["manager", "admin"]),
  getAllPharmacies_addSeller,
);
managerRouter.get(
  "/managers",
  ...withAuth(["manager", "admin"]),
  getAllManagers,
);
managerRouter.get("/admins", ...withAuth(["manager", "admin"]), getAllAdmins);
managerRouter.get(
  "/conflicts",
  ...withAuth(["manager", "admin"]),
  getAllConflicts,
);

export default managerRouter;
