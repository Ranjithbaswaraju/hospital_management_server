require("./env");

const mongoose = require("mongoose");
const { getMongoUri, maskMongoUri } = require("./env");

const dbName = process.env.MONGO_DB_NAME || "Hospital";

async function ConnectDB() {
  const uri = getMongoUri();

  // Temporary: confirm which database URL is active (password masked)
  console.log("MONGO_URI in use:", maskMongoUri(uri));
  console.log("MongoDB database name:", dbName);

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(uri, { dbName });
    return mongoose.connection;
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
}

module.exports = { ConnectDB, getMongoUri, maskMongoUri };
