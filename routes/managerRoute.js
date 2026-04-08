import express from "express";
import {
  getAllProducts,
  getAllSellers,
  getAllPharmacies,
  addSeller,
  getAllPharmacies_addSeller,
  getAllManagers,
  getAllAdmins,
} from "../controllers/managerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const managerRouter = express.Router();

// managerRouter.get("/products", authUser(getSellersArray), getAllProducts);
managerRouter.get("/products", getAllProducts);
managerRouter.get("/sellers", getAllSellers);
managerRouter.post("/seller", addSeller);
managerRouter.get("/pharmacies", getAllPharmacies);
managerRouter.get("/pharmacies-add-seller", getAllPharmacies_addSeller);
managerRouter.get("/managers", getAllManagers);
managerRouter.get("/admins", getAllAdmins);

export default managerRouter;
