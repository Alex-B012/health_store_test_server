import { verifyTelegramInitData } from "../bot/bot.js";
import {
  handleServerError,
  isAuthorizedSeller,
  normalizeAPIKey,
} from "../utils/utils.js";

const authUser = (getSellersArray) => {
  console.log("authUser - start:");

  return async (req, res, next) => {
    try {
      const SELLERS = getSellersArray();

      const { scannerData } = req.body || {};

      console.log("scannerData - received:", scannerData);

      if (
        !scannerData ||
        !Array.isArray(scannerData) ||
        scannerData.length === 0
      ) {
        console.log("Invalid scannerData format");
        return res
          .status(400)
          .json({ success: false, message: "Invalid scannerData format" });
      }

      const { userId, chatId, telegramInitData } = scannerData[0];

      // console.log("scannerData[0].chatId:", chatId);
      // console.log("Expected CHAT_ID:", process.env.CHAT_ID);

      // if (chatId !== Number(process.env.CHAT_ID)) {
      //   console.log("Unauthorized: chat ID not registered");
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized: chat ID not registered",
      //   });
      // }

      if (!isAuthorizedSeller(SELLERS, userId)) {
        console.log("Unauthorized: user not registered");
        return res.status(403).json({
          success: false,
          message: "Unauthorized: user not registered",
        });
      }

      const headerValue = normalizeAPIKey(req.headers["x-api-key"]);
      const apiKey = normalizeAPIKey(process.env.API_KEY);

      if (headerValue !== apiKey) {
        console.log("Unauthorized: invalid API key", { headerValue, apiKey });
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: invalid API key" });
      }

      // try {
      //   const verifiedData = verifyTelegramInitData(
      //     telegramInitData,
      //     process.env.TELEGRAM_BOT_TOKEN,
      //   );
      //   req.telegramUserId = Number(verifiedData.user.id);
      // } catch (error) {
      //   console.error("Error verifying Telegram initData:", error);
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized: invalid Telegram data",
      //   });
      // }

      next();
    } catch (error) {
      handleServerError(res, error);
    }
  };
};

export default authUser;
