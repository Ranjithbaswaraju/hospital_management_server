const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
let url = process.env.MONGO_URL;

async function ConnectDB() {
  try {
    await mongoose.connect(url, { dbName: "Hospital" });
  } catch (err) {
    console.log(err);
  }
}
module.exports = { ConnectDB };
