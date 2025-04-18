const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

function connectDB() {
  return mongoose.connect((`${process.env.MONGO_URI}`));
}

module.exports = connectDB;
