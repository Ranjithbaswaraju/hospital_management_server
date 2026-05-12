const DoctorModel = require("../Models/DoctorModel");

const Doctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find();
    return res.status(200).json({
      success: true,
      Message: "Doctors Fetched Successfully",
      doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      Message: "Unable to load the doctors",
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
    const { specialization } = req.params;

    const doctors = await DoctorModel.find({
      specialization,
    });

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
module.exports = { Doctors, SingleDoctor, FilterDoctor };
