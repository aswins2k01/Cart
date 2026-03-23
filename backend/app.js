const express = require("express");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const products = require("./routes/products");
const errorMiddleware = require("./middlewares/error");
const auth = require("./routes/auth");
const order = require("./routes/order");
const payment = require("./routes/payment");
const cookieParser = require("cookie-parser");

app.set("query parser", "extended");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use("/api/v1", products);
app.use("/api/v1", auth);
app.use("/api/v1", order);
app.use("/api/v1", payment);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*path", (req, res) => {
    res.sendFile(path.join(__dirname, "..frontend/dist/index.html"));
  });
}

app.use(errorMiddleware);

app.use((req, res) => {
  console.log("Attempted URL:", req.originalUrl);
  res.status(404).send("Route not found on server");
});
module.exports = app;
