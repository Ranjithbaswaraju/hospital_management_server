const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  
  {
    name:{
      type:String
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthModel",
    },

    specialization: {
      type: String,
      required: true,
      enum: [
        "Cardiology",

        "Dermatology",

        "Neurology",

        "Orthopaedics",

        "Paediatrics",

        "Gynaecology and obstetrics",

        "ENT",

        "Ophthalmology",

        "Psychiatry and mental health",
      ],
    },
    experience: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    hospital: {
      type: String,
    },
    //     image:{
    //     type:String
    // }
  },
  { timestamps: true },
);

const DoctorModel = mongoose.model("Doctor", DoctorSchema);
module.exports = DoctorModel;
