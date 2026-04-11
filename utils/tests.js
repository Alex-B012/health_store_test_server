import { PRODUCTS_NAMES, warehouse_employees } from "../data/data.js";
import sellerModel from "../models/sellerModel.js";

const test_generateProductName = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timestamp = `${year}-${month}-${day} - ${hours}:${minutes}:${seconds}`;

  // const isOddDay = now.getDate() % 2 === 1;
  // const availableProducts = isOddDay
  //   ? PRODUCTS_NAMES.filter((item) => !item.name.includes("Тест товар"))
  //   : PRODUCTS_NAMES;

  const randomName =
    PRODUCTS_NAMES[Math.floor(Math.random() * PRODUCTS_NAMES.length)];

  return `${timestamp} - ${randomName}`;
};

const test_getRandomNumber = (array) => {
  const filteredArray = array.filter((num) => num !== 1);
  if (filteredArray.length === 0) return null;

  return filteredArray[Math.floor(Math.random() * filteredArray.length)];
};

function test_getRandomStockDate() {
  const now = new Date();

  const end = new Date(now);
  end.setDate(end.getDate() - 1);

  const start = new Date(now);
  start.setDate(start.getDate() - 14);

  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());

  return new Date(randomTime);
}

const test_generateQrCode = (inputQrCode = null) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const code =
    inputQrCode || Math.floor(100000 + Math.random() * 900000).toString();

  return `${year}-${month}-${day}_${hours}-${minutes}_test_${code}`;
};

const test_getRandomSellerId = async () => {
  try {
    const sellers = await sellerModel.find({}, { _id: 1 }).lean();
    if (!sellers.length) throw new Error("No sellers found");

    const uniqueIds = [...new Set(sellers.map((s) => s._id.toString()))];

    if (!uniqueIds.length) throw new Error("No valid sellers found");

    const randomIndex = Math.floor(Math.random() * uniqueIds.length);
    return uniqueIds[randomIndex];
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return null;
  }
};

export {
  test_generateProductName,
  test_getRandomNumber,
  test_getRandomStockDate,
  test_generateQrCode,
  test_getRandomSellerId,
};
