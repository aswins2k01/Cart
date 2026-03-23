const { server } = require("..server/");
module.exports = (err) => {
  process.on("uncaughtException", (err) => {
    console.log(` Error : ${err.message}`);
    console.log("Shutting down due to the uncaught error");
    server.close(() => {
      process.exit();
    });
  });
};
