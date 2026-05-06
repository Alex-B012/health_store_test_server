import Counter from "../models/Counter.js";

async function getNextSequence(name) {
  const result = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 7 } },
    {
      upsert: true,
      returnDocument: "after",
    },
  );

  return result.seq;
}

// Generate random QR code
const generateQRCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomPart = "";

  for (let i = 0; i < 20; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `test_qr_code_${randomPart}`;
};

// Get random element from array
const getRandomFromArray = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Get random date between two dates
function getRandomDate(start, end) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}
const now = new Date();
// 2 weeks ago → 1 week ago
const twoWeeksAgo = new Date(now);
twoWeeksAgo.setDate(now.getDate() - 14);

const oneWeekAgo = new Date(now);
oneWeekAgo.setDate(now.getDate() - 7);

// Get random Telegram ID for testing

const getRandomTelegramId = (arr) => {
  const existing = Array.isArray(arr) ? arr : [];
  const maxAttempts = 1000;

  for (let i = 0; i < maxAttempts; i++) {
    const randomId = Math.floor(10000000 + Math.random() * 90000000);
    if (!existing.includes(randomId)) return randomId;
  }

  throw new Error("Unable to generate unique Telegram ID");
};

const generateRandomPhone = () => {
  const prefix = Math.random() < 0.5 ? "+7" : "8";
  const rest = Math.floor(10000000 + Math.random() * 9000000000).toString();
  return prefix + rest;
};

export {
  getNextSequence,
  generateQRCode,
  getRandomFromArray,
  getRandomDate,
  twoWeeksAgo,
  oneWeekAgo,
  getRandomTelegramId,
  generateRandomPhone,
};
