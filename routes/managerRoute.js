import express from "express";
import multer from "multer";
import {
  getDashboardData,
  getAllProducts,
  getProductById,
  getAllSellers,
  getAllPharmacies,
  getPharmacyById,
  addPharmacy,
  getAddPharmaciesData,
  addSeller,
  getAllPharmacies_addSeller,
  getAllManagers,
  getAddManagerData,
  addManager,
  getAllAdmins,
  getProductsAddData,
  getProductCategoriesAddData,
  getSellerById,
  addProducts,
  addProductCategory,
  getAllConflicts,
} from "../controllers/managerController.js";

import { telegramAuth } from "../bot/telegramAuth.js";
import { requireRole } from "../middlewares/authUser.js";

const managerRouter = express.Router();
const upload = multer({ dest: "uploads/" });

const useAuth = process.env.USE_AUTH === "true";

const withAuth = (roles = []) => {
  console.log("withAuth - start");
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

managerRouter.get(
  "/products-categories-add-data",
  ...withAuth(["manager", "admin"]),
  getProductCategoriesAddData,
);

managerRouter.post(
  "/add-product-category",
  ...withAuth(["manager", "admin"]),
  addProductCategory,
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
  "/add-pharmacies-data",
  ...withAuth(["manager", "admin"]),
  getAddPharmaciesData,
);

managerRouter.post(
  "/add-pharmacy",
  ...withAuth(["manager", "admin"]),
  addPharmacy,
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

managerRouter.get(
  "/manager-add-data",
  ...withAuth(["admin"]),
  getAddManagerData,
);

managerRouter.post("/manager", ...withAuth(["admin"]), addManager);

managerRouter.get("/admins", ...withAuth(["manager", "admin"]), getAllAdmins);
managerRouter.get(
  "/conflicts",
  ...withAuth(["manager", "admin"]),
  getAllConflicts,
);

export default managerRouter;
