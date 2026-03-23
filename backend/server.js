// const { log } = require('console')
process.on("uncaughtException", (err) => {
  console.log(` Error : ${err.message}`);
  console.log("Shutting down due to the uncaught error");
  process.exit();
});
const express = require("express");
const app = require("./app");

const path = require("path");
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
