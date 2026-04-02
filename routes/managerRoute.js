import express from "express";
import { getAllProducts } from "../controllers/managerController.js";
import authUser from "../middlewares/authUser.js";
import { getSellersArray } from "../utils/utils.js";

const managerRouter = express.Router();

// managerRouter.get("/products", authUser(getSellersArray), getAllProducts);
managerRouter.get("/products", getAllProducts);

export default managerRouter;
