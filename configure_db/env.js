const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");

// override: true ensures .env wins over stale OS/terminal MONGO_URI/MONGO_URL values
dotenv.config({ path: envPath, override: true });

function getMongoUri() {
  const uri = process.env.MONGO_URI || process.env.MONGO_URL;

  if (!uri || !String(uri).trim()) {
    throw new Error(
      "MongoDB URI missing. Set MONGO_URI in Hosiptal_Managemnt_Server/.env",
    );
  }

  return String(uri).trim();
}

/** Mask password in logs — never log full connection strings in production */
function maskMongoUri(uri) {
  return uri.replace(/:([^:@/]+)@/, ":****@");
}

module.exports = { envPath, getMongoUri, maskMongoUri };
