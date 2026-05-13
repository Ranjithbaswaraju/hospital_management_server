const DoctorModel = require("../Models/DoctorModel");
const SlotModel = require("../Models/SlotModel");

const Doctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find().populate("userId");

    return res.status(200).json({
      success: true,
      message: "Doctors Fetched Successfully",
      doctors,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to load the doctors",
    });
  }
};
const SingleDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    const singleDoctor = await DoctorModel.findById(id);
    return res.status(200).json({
      success: true,
      message: "Single Doctor Fetched",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Message: "Unable to load the single doctors",
      singleDoctor,
    });
  }
};
const FilterDoctor = async (req, res) => {
  try {
    const { type } = req.params;

    const doctors = await DoctorModel.find({
      specialization: {
        $regex: type,
        $options: "i",
      },
    }).populate("userId");

    return res.status(200).json({
      success: true,

      message: "Doctors Filtered Successfully",

      doctors,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Unable to Filter Doctors",
    });
  }
};
const GetSlots = async (req, res) => {
  const { doctorId, date } = req.params;

  console.log(doctorId, date);
  try {
    const slots = await SlotModel.find({
      doctorId: doctorId,

      date: date,

      isBooked: false,
    });

    // console.log(slots);

    return res.status(200).json({
      success: true,

      slots,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Unable to fetch slots",
    });
  }
};

module.exports = { FilterDoctor, Doctors, SingleDoctor, GetSlots };
