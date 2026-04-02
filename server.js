import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ngrok from "ngrok";
import { startServer } from "./utils/serverManager.js";
import {
  getSellersArray,
  handleNodemonRestart,
  isAuthorizedSeller,
} from "./utils/utils.js";

import {
  loggingMiddleware,
  tokenVerificationMiddleware,
} from "./middlewares/middleware.js";

import TelegramBot from "node-telegram-bot-api";
import { checkChatId } from "./bot/bot.js";
import scannerRouter from "./routes/scannerRoute.js";
import connectDB from "./db_config/mongodb.js";
import {
  admins_populate,
  managers_populate,
  sellers_populate,
  products_populate,
} from "./db_service/service.js";
import managerRouter from "./routes/managerRoute.js";

dotenv.config();

const app = express();

// const LOCALHOST_URL = process.env.LOCALHOST_URL;
// const SCANNER_URL = process.env.SCANNER_URL;
const SCANNER_URL_APP = process.env.SCANNER_URL_APP;

const PORT = Number(process.env.PORT) || 8080;
const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

const CHAT_ID = Number(process.env.CHAT_ID);
const SELLERS = getSellersArray();

connectDB();

// --- TESTING - Populate database with initial data ---
// const isPopulateAdmins = false;
// const isPopulateManagers = false;
// const isPopulateSellers = false;
// const isPopulateProducts = false;
// if (isPopulateAdmins) admins_populate();
// if (isPopulateManagers) managers_populate();
// if (isPopulateSellers) {
//   sellers_populate();
//   products_populate();
//   products_populate();
// }
// if (isPopulateProducts) products_populate();

app.use(express.json());

// app.use(
//   cors({
//     origin: [LOCALHOST_URL, SCANNER_URL],
//   }),
// );

app.use(cors({}));

// --- Middleware ---
app.use(loggingMiddleware);
// app.use(tokenVerificationMiddleware(API_KEY));

// --- Routes ---
app.use("/api/scanner", scannerRouter);
app.use("/api/manager", managerRouter);

app.get("/", (req, res) => {
  res.send("Hello! Server is running safely with ngrok.");
});

app.post("/api/test", (req, res) => {
  res.json({ message: "This is secure API data." });
});

// --- Error handling middleware ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  console.log(`Received message from chatId=${chatId}:`, text);

  if (text === "/start") {
    if (!isAuthorizedSeller(SELLERS, userId) || chatId !== CHAT_ID)
      return bot.sendMessage(
        chatId,
        `Unauthorized access. You are not registered as a seller.\nYour Telegram ID: ${chatId}`,
      );

    return bot.sendMessage(
      chatId,
      "AgACAgIAAxkBAAEKHFxpa_vsbDbT2PMUh6IGx-7mhl2myQACvwxrG01UYEuIl19rH-5qRAEAAwIAA3gAAzgE",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Открыть Сканер", web_app: { url: SCANNER_URL_APP } }],
          ],
        },
      },
    );
  } else if (text === "/manager") {
    return bot.sendMessage(chatId, `Manager command received: ${text}`);
  } else if (text === "/admin") {
    return bot.sendMessage(chatId, `Admin command received: ${text}`);
  }

  if (!checkChatId(chatId))
    return console.log("Received message from unauthorized chat ID:", chatId);

  bot.sendMessage(chatId, `Message received: ${text}`);
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err);
});

// --- Start server and ngrok tunnel ---
startServer(app, PORT, ngrok, handleNodemonRestart);
console.log("Telegram bot running...");
