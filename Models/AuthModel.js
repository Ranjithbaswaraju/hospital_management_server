const mongoose = require("mongoose");

const AuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "patient"],
      default: "patient",
    },
  },
  { timestamps: true },
);

const AuthModel = mongoose.model("AuthModel", AuthSchema);
module.exports = AuthModel;
