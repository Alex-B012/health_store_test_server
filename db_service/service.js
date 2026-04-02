import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import {
  admins,
  managers,
  pharmacies_codes,
  product_names,
  sellers,
  warehouse_employees,
} from "../data/data.js";
import sellerModel from "../models/sellerModel.js";
import {
  generateQRCode,
  getRandomDate,
  getRandomFromArray,
  oneWeekAgo,
  twoWeeksAgo,
} from "./db_utils.js";
import productModel from "../models/productModel.js";

const admins_populate = async () => {
  try {
    const preparedAdmins = admins.map((admin, index) => ({
      ...admin,
      admin_id: index + 1,
    }));
    await adminModel.insertMany(preparedAdmins);

    console.log("Admins populated successfully");
  } catch (error) {
    console.error("ERROR - admins populating:", error);
  }
};

const managers_populate = async () => {
  try {
    const preparedManagers = managers.map((manager, index) => ({
      ...manager,
      telegram_id: manager.telegram_id || index + 1,
    }));
    await managerModel.insertMany(preparedManagers);

    console.log("Managers populated successfully");
  } catch (error) {
    console.error("ERROR - managers populating:", error);
  }
};

const sellers_populate = async () => {
  try {
    const preparedSellers = sellers.map((seller, index) => ({
      ...seller,
      telegram_id: seller.telegram_id || index + 1,
    }));
    await sellerModel.insertMany(preparedSellers);

    console.log("Sellers populated successfully");
  } catch (error) {
    console.error("ERROR - sellers populating:", error);
  }
};

const products_populate = async () => {
  try {
    console.log(`Products populating - started`);
    // 🔹 Fetch seller IDs
    const sellers = await sellerModel.find({}, { _id: 1 });

    if (!sellers.length) throw new Error("No sellers found in DB");

    const sellerIds = sellers.map((s) => s._id);

    // 🔹 Generate products
    const products = [];

    const NUM_PRODUCTS = 50;

    for (let i = 0; i < NUM_PRODUCTS; i++) {
      let saleQr;

      // Ensure unique QR (important due to unique index)
      let isUnique = false;
      while (!isUnique) {
        saleQr = generateQRCode();
        const exists = await productModel.findOne({
          "sale_entry.qr_code": saleQr,
        });
        if (!exists) isUnique = true;
      }

      products.push({
        name: product_names[Math.floor(Math.random() * product_names.length)],
        pharmacy_id: pharmacies_codes.filter((code) => code !== 1)[
          Math.floor(Math.random() * (pharmacies_codes.length - 1))
        ],

        stock_entry: {
          qr_code: saleQr,
          date: getRandomDate(twoWeeksAgo, oneWeekAgo),
          employee_id:
            warehouse_employees[
              Math.floor(Math.random() * warehouse_employees.length)
            ],
        },

        sale_entry: {
          qr_code: saleQr,
          date: getRandomDate(oneWeekAgo, new Date()),
          seller_id: getRandomFromArray(sellerIds),
        },
      });
    }

    // 🔹 Insert into DB
    await productModel.insertMany(products);

    console.log(
      `Products populated successfully - Inserted ${NUM_PRODUCTS} products`,
    );

    console.log("");
  } catch (error) {
    console.error("ERROR - products populating:", error);
  }
};

export {
  admins_populate,
  managers_populate,
  sellers_populate,
  products_populate,
};
