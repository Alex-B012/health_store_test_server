import express from "express";
import multer from "multer";
import { getRole } from "../controllers/adminController.js";

import { telegramAuth } from "../bot/telegramAuth.js";
import { requireRole } from "../middlewares/authUser.js";

const adminRouter = express.Router();

const useAuth = process.env.USE_AUTH === "true";

const withAuth = (roles = []) => {
  console.log("admin - withAuth - start");
  if (!useAuth) return [];
  return [telegramAuth(), requireRole(roles)];
};

adminRouter.get("/user", ...withAuth(["manager", "admin"]), getRole);

export default adminRouter;
