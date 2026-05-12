import crypto from "crypto";
import sellerModel from "../models/sellerModel.js";
import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function verifyTelegramInitData(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(BOT_TOKEN)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (calculatedHash !== hash) return null;

  const authDate = Number(params.get("auth_date"));
  if (Date.now() / 1000 - authDate > 86400) return null;

  return {
    user: JSON.parse(params.get("user")),
  };
}

// Middleware factory (permission-aware)
function telegramAuth() {
  console.log("telegramAuth - start");

  return async (req, res, next) => {
    const initData = req.headers.authorization;
    console.log("initData:", initData);

    if (!initData)
      return res.status(401).json({ error: "Missing Authorization header" });

    const verified = verifyTelegramInitData(initData);
    if (!verified)
      return res.status(403).json({ error: "Invalid Telegram init data" });

    const telegram_id = String(verified.user.id);

    console.log("telegramId:", telegram_id);

    const role_seller = await sellerModel.findOne({ telegram_id });
    const role_admin = await adminModel.findOne({ admin_id: telegram_id });
    let role_manager = null;

    console.log("Roles:", role_seller, role_admin);

    if (!role_seller && !role_admin)
      role_manager = await managerModel.findOne({ telegram_id });

    if (!role_seller && !role_admin && !role_manager)
      return res.status(403).json({ error: "No permissions assigned" });

    req.telegramUser = verified.user;
    console.log("req.telegramUser:", req.telegramUser);
    console.log("verified.user:", verified.user);
    req.permission_role = role_admin
      ? "admin"
      : role_seller
        ? "seller"
        : "manager";

    next();
  };
}

// Middleware factory (permission-aware) for a bot call
async function telegramAuth_bot(id) {
  console.log("telegramAuth_bot - start");

  const telegram_id = String(id);

  const role_seller = await sellerModel.findOne({ telegram_id });
  const role_admin = await adminModel.findOne({ admin_id: telegram_id });

  let role_manager = null;

  if (!role_seller && !role_admin)
    role_manager = await managerModel.findOne({ telegram_id });

  if (!role_seller && !role_admin && !role_manager)
    return "No permissions assigned";

  const result = role_admin ? "admin" : role_seller ? "seller" : "manager";

  return result;
}

export { telegramAuth, telegramAuth_bot };
