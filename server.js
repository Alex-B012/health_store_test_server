import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import ngrok from "ngrok";
import { startServer } from "./utils/serverManager.js";
import {
  getSellersArray,
  handleNodemonRestart,
  isAuthorizedSeller,
  parseEnvArray,
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
  products_populate_array,
  pharmacies_populate,
  populateProductNames,
} from "./db_service/service.js";
import managerRouter from "./routes/managerRoute.js";

dotenv.config();

const app = express();

// const LOCALHOST_URL = process.env.LOCALHOST_URL;
const SCANNER_URL = process.env.SCANNER_URL;
const MANAGER_URL_APP = process.env.MANAGER_URL_APP;
const SERVER_URL = process.env.SERVER_URL;
const allowedOrigins = [MANAGER_URL_APP, SCANNER_URL];

const PORT = Number(process.env.PORT) || 8080;
const API_KEY = process.env.API_KEY;
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
// const bot = new TelegramBot(TOKEN, { polling: true });
const bot = new TelegramBot(TOKEN);

const CHAT_IDS = process.env.CHAT_IDS;
const SELLERS = getSellersArray();

connectDB();

// --- TESTING - Populate database with initial data ---
// const isPopulateAdmins = false;
// const isPopulateManagers = false;
// const isPopulatePharmacies = false;
// const isPopulateSellers = false;
// const isPopulateProductNames = false;
// const isPopulateProducts = false;
// const isPopulateProductsArray = false;
// if (isPopulateAdmins) admins_populate();
// if (isPopulateManagers) managers_populate();
// if (isPopulatePharmacies) pharmacies_populate();
// if (isPopulateSellers) {
//   sellers_populate();
//   products_populate();
//   products_populate();
// }
// if (isPopulateProductNames) populateProductNames();
// if (isPopulateProducts) products_populate();
// if (isPopulateProductsArray) products_populate_array();

app.use(express.json());

bot.setWebHook(`${SERVER_URL}/bot${TOKEN}`);

// app.use((req, res, next) => {
//   console.log("Request origin:", req.headers.origin);
//   next();
// });

// app.use((req, res, next) => {
//   console.log("🔥 Incoming request:", req.method, req.url);
//   next();
// });

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log("Request origin:", origin);

  const allowedHeaders = ["Content-Type", "Authorization", "x-api-key"];

  // Always set these
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  // res.setHeader("Access-Control-Allow-Headers", allowedHeaders.join(", "));

  // Handle allowed origins
  if (
    origin &&
    (allowedOrigins.includes(origin) || origin.endsWith(".ngrok-free.dev"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  // Handle preflight FIRST
  if (req.method === "OPTIONS") return res.sendStatus(204);

  next();
});

// app.use(cors({}));
// --- Middleware ---
app.use(loggingMiddleware);
// app.use(tokenVerificationMiddleware(API_KEY));

// --- Routes ---
app.use(
  "/api/scanner",
  (req, res, next) => {
    console.log("scannerRouter hit:", req.method, req.url);
    next();
  },
  scannerRouter,
);
app.use(
  "/api/manager",
  (req, res, next) => {
    console.log("managerRouter hit:", req.method, req.url);
    next();
  },
  managerRouter,
);

app.get("/", (req, res) => {
  res.send("Hello! Server is running safely with ngrok.");
});

app.post("/api/test", (req, res) => {
  res.json({ message: "This is secure API data." });
});

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
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

  console.log(
    `Received message from chatId=${chatId}:`,
    text,
    "\n",
    `userId=${userId}:`,
    // userId,
  );

  if (text === "/start") {
    const isAllowedChat = parseEnvArray(CHAT_IDS)
      .map((id) => id.trim())
      .includes(chatId.toString());
    const isAuthorized = isAuthorizedSeller(SELLERS, userId);

    const chatIdsArray = parseEnvArray(CHAT_IDS);

    // console.log(
    //   "chatId:",
    //   `'${chatId.toString()}' (type: ${typeof chatId.toString()})`,
    // );
    // chatIdsArray.forEach((id, index) => {
    //   console.log(`Element ${index}: '${id}' (type: ${typeof id})`);
    // });

    // console.log("Type:", typeof parseEnvArray(CHAT_IDS));
    // console.log("parseEnvArray(CHAT_IDS)", parseEnvArray(CHAT_IDS));

    // console.log("isAllowedChat:", isAllowedChat);

    console.log(
      "isAuthorized - ",
      isAuthorized,
      "isAllowedChat - ",
      isAllowedChat,
    );

    if (!isAllowedChat)
      return bot.sendMessage(
        chatId,
        `Unauthorized access. You are not registered as a seller.\n
        Your Telegram Chat ID: ${chatId}.\n
        Please send this ID to the admin to complete your registration.`,
      );

    return bot.sendMessage(
      chatId,
      `<b>━━ </b><b> AKIS Pharma -- Demo </b><b> ━━</b>\n\nВыберите действие:`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть Сканер",
                web_app: { url: `${SCANNER_URL}` },
              },
            ],
            [
              {
                text: "Добавить продавца",
                web_app: { url: `${MANAGER_URL_APP}/add-seller` },
              },
            ],
            [
              {
                text: "Панель Менеджера",
                web_app: { url: `${MANAGER_URL_APP}` },
              },
            ],
          ],
        },
      },
    );
  } else if (text === "/admin") {
    return bot.sendMessage(chatId, `Admin command received: ${text}`);
  } else if (text === "/super_secret_demo") {
    return bot.sendMessage(
      chatId,
      `<b>━━ </b><b> AKIS Pharma -- Demo </b><b> ━━</b>\n\nВыберите действие:`,
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть Сканер",
                web_app: { url: `${SCANNER_URL}` },
              },
            ],
            [
              {
                text: "Добавить продавца",
                web_app: { url: `${MANAGER_URL_APP}/add-seller` },
              },
            ],
            [
              {
                text: "Панель Менеджера",
                web_app: { url: `${MANAGER_URL_APP}` },
              },
            ],
          ],
        },
      },
    );
  }

  if (!checkChatId(chatId))
    return console.log("Received message from unauthorized Chat ID:", chatId);

  bot.sendMessage(chatId, `Message received: ${text}`);
});

bot.on("polling_error", (err) => {
  console.error("Polling error:", err);
});

// --- Start server and ngrok tunnel ---
startServer(app, PORT, ngrok, handleNodemonRestart);
console.log("Telegram bot running...");
