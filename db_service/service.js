import adminModel from "../models/adminModel.js";
import managerModel from "../models/managerModel.js";
import productNameModel from "../models/productNameModel.js";
import productModel from "../models/productModel.js";
import pharmacyModel from "../models/pharmacyModel.js";
import sellerModel from "../models/sellerModel.js";
import {
  ADMINS,
  MANAGERS,
  pharmacies_codes,
  PRODUCTS,
  PRODUCTS_NAMES,
  SELLERS,
  warehouse_employees,
  PHARMACIES,
} from "../data/data.js";

import {
  generateQRCode,
  getRandomDate,
  getRandomFromArray,
  oneWeekAgo,
  twoWeeksAgo,
} from "./db_utils.js";

const admins_populate = async () => {
  try {
    const preparedAdmins = ADMINS.map((admin, index) => ({
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
    const preparedManagers = MANAGERS.map((manager, index) => ({
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
    const preparedSellers = SELLERS.map((seller, index) => ({
      ...seller,
      telegram_id: seller.telegram_id || index + 1,
    }));
    await sellerModel.insertMany(preparedSellers);

    console.log("Sellers populated successfully");
  } catch (error) {
    console.error("ERROR - sellers populating:", error);
  }
};

const pharmacies_populate = async () => {
  console.log(`Pharmacies populating - started`);
  try {
    await pharmacyModel.insertMany(PHARMACIES, { ordered: false });
    console.log("Pharmacies populated successfully");
  } catch (error) {
    if (error.code === 11000) {
      console.log(
        "Some pharmacies were already in the database and were skipped",
      );
    } else {
      console.error("ERROR - pharmacies populating:", error);
    }
  }
};

const populateProductNames = async () => {
  try {
    console.log("Product names populating - started");

    const result = await productNameModel.insertMany(PRODUCTS_NAMES, {
      ordered: false,
    });

    console.log("INSERTED:", result.length);
    console.log("Product names populated successfully");
  } catch (error) {
    console.error("ERROR - product names populating:");

    console.error(JSON.stringify(error, null, 2));
  }
};

const products_populate = async () => {
  try {
    console.log(`Products populating - started`);

    const sellers = await sellerModel.find({}, { _id: 1 });
    if (!sellers.length) throw new Error("No sellers found in DB");

    const sellerIds = sellers.map((s) => s._id);

    const productNames = await productNameModel
      .find({}, { _id: 1, name: 1 })
      .lean();

    if (!productNames.length) {
      throw new Error("No product names found");
    }

    const filteredPharmacies = pharmacies_codes.filter((code) => code !== 1);

    const products = [];
    const NUM_PRODUCTS = 100;

    for (let i = 0; i < NUM_PRODUCTS; i++) {
      let saleQr;

      let isUnique = false;
      while (!isUnique) {
        saleQr = generateQRCode();
        const exists = await productModel.findOne({
          "sale_entry.qr_code": saleQr,
        });
        if (!exists) isUnique = true;
      }

      const randomProduct =
        productNames[Math.floor(Math.random() * productNames.length)];

      products.push({
        name: randomProduct.name,
        name_id: randomProduct._id,
        pharmacy_id:
          filteredPharmacies[
            Math.floor(Math.random() * filteredPharmacies.length)
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

    await productModel.insertMany(products);

    console.log(
      `Products populated successfully - Inserted ${NUM_PRODUCTS} products`,
    );
  } catch (error) {
    console.error("ERROR - products populating:", error);
  }
};

const products_populate_array = async () => {
  try {
    console.log(`Products populating array - started`);

    const products = [];

    for (const item of PRODUCTS) {
      products.push({
        name: item.name,
        name_id: item.name_id,
        pharmacy_id: item.pharmacy_id,

        stock_entry: {
          qr_code: item.stock_entry.qr_code,
          date: item.stock_entry.date,
          employee_id: item.stock_entry.employee_id,
        },
      });
    }

    await productModel.insertMany(products);

    console.log(
      `Products populated successfully - Inserted ${products.length} products`,
    );
  } catch (error) {
    console.error("ERROR - products populating:", error);
  }
};

export {
  admins_populate,
  managers_populate,
  sellers_populate,
  products_populate,
  products_populate_array,
  pharmacies_populate,
  populateProductNames,
};
