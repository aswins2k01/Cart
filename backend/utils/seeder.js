const ProductModel = require("../models/productmodel");
const ProductData = require("../data/products.json");
const dotenv = require("dotenv");
const databaseConnect = require("../config/db");

dotenv.config({ path: "backend/config/config.env" });
databaseConnect();

const seedProducts = async () => {
  try {
    await ProductModel.deleteMany();
    console.log("products deleted");

    await ProductModel.insertMany(ProductData);
    console.log("products added ");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

seedProducts();
