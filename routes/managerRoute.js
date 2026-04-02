import express from "express";
import {
  getAllProducts,
  getAllSellers,
} from "../controllers/managerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const managerRouter = express.Router();

// managerRouter.get("/products", authUser(getSellersArray), getAllProducts);
managerRouter.get("/products", getAllProducts);
managerRouter.get("/sellers", getAllSellers);

export default managerRouter;
