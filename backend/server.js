// const { log } = require('console')
process.on("uncaughtException", (err) => {
  console.log(` Error : ${err.message}`);
  console.log("Shutting down due to the uncaught error");
  process.exit();
});

const app = require("./app");

const databaseConnect = require("./config/db");

databaseConnect();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server is listening to the port : ${process.env.PORT} in ${process.env.NODE_ENV}`,
  );
});

process.on("unhandledRejection", (err) => {
  console.log(` Error : ${err.message}`);
  console.log("Shutting down due to the unhandled rejection error");
  server.close(() => {
    process.exit();
  });
});

const axios = require("axios");

const URL = `https://aswin-cart-app.onrender.com/ping`;

// Keep-alive logic
setInterval(() => {
  axios
    .get(URL)
    .then(() => console.log("Keep-alive: Self-ping successful"))
    .catch((err) => console.error("Keep-alive: Self-ping failed", err.message));
}, 840000); // 14 minutes
