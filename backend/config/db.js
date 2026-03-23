const mongoose = require("mongoose");

const databaseConnect = () => {
  mongoose.connect(process.env.DB_LOCAL_URI).then((con) => {
    console.log(`Mongodb is connected to the host: ${con.connection.host}`);
  });
};

module.exports = databaseConnect;
