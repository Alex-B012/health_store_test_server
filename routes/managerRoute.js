import express from "express";
import {
  getAllProducts,
  getAllSellers,
  getAllPharmacies,
  addSeller,
  getAllPharmacies_addSeller,
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

export default managerRouter;
