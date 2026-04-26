import express from "express";
import telegramAuth from "../bot/telegramAuth.js";
import { scanProduct, getProfile } from "../controllers/scannerController.js";
import { requireRole } from "../middlewares/authUser.js";

const scannerRouter = express.Router();

scannerRouter.post(
  "/product",
  telegramAuth(),
  requireRole(["seller", "admin"]),
  scanProduct,
);

scannerRouter.get(
  "/profile",
  telegramAuth(),
  requireRole(["seller", "admin"]),
  getProfile,
);

export default scannerRouter;
