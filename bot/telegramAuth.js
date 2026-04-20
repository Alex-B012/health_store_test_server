// const crypto = require("crypto");
import crypto from "crypto";
// const Roles = require("../models/roles.js");

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

  // Optional: auth_date freshness check
  const authDate = Number(params.get("auth_date"));
  if (Date.now() / 1000 - authDate > 86400) return null;

  return {
    user: JSON.parse(params.get("user")),
  };
}

// Middleware factory (permission-aware)
function telegramAuth(allowedRoles) {
  return async (req, res, next) => {
    const initData = req.headers.authorization;

    if (!initData)
      return res.status(401).json({ error: "Missing Authorization header" });

    const verified = verifyTelegramInitData(initData);
    if (!verified)
      return res.status(403).json({ error: "Invalid Telegram init data" });

    const telegramId = String(verified.user.id);

    console.log("telegramId:", telegramId);

    // Load permissions from DB
    const role = await Roles.findOne({ telegramId });

    if (!role)
      return res.status(403).json({ error: "No permissions assigned" });

    //     if (allowedRoles.includes(role.type)) {
    //       return res.status(403).json({
    //         error: `Not allowed`,
    //       });
    //     }

    // Attach useful data
    req.telegramUser = verified.user;
    //     req.permissions = record.permissions;

    next();
  };
}

// module.exports =  telegramAuth ;
export default telegramAuth;
