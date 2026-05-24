const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthModel",
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
    },
    status: {
      type: String,
      enum: [ "All",
  "Upcoming",
  "Completed",
  "Cancelled",
  "Booked"],
      default: "Booked",
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

const AppointmentModel = mongoose.model("appointment", AppointmentSchema);
module.exports = AppointmentModel;
