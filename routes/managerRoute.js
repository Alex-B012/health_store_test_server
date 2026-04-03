import express from "express";
import {
  getAllProducts,
  getAllSellers,
  getAllPharmacies,
  addSeller,
} from "../controllers/managerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const managerRouter = express.Router();

// managerRouter.get("/products", authUser(getSellersArray), getAllProducts);
managerRouter.get("/products", getAllProducts);
managerRouter.get("/sellers", getAllSellers);
managerRouter.post("/seller", addSeller);
managerRouter.get("/pharmacies", getAllPharmacies);

export default managerRouter;
