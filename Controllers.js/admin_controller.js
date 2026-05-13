const AppointmentModel = require("../Models/AppointmentModel");
const AuthModel = require("../Models/AuthModel");
const DoctorModel = require("../Models/DoctorModel");
const bcrypt = require("bcrypt");

const AddDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience,
      fees,
      hospital,
    } = req.body;

    const doctorExist = await AuthModel.findOne({ email });

    if (doctorExist) {
      return res.status(400).json({
        success: false,
        message: "Doctor Already Exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await AuthModel.create({
      name,
      email,
      password: hashedPassword,
      role: "doctor",
    });

    const doctor = await DoctorModel.create({
      name,
      userId: user._id,

      specialization,

      experience,
      fees,

      hospital,
    });

    return res.status(201).json({
      success: true,

      message: "Doctor Added Successfully",

      doctor,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,

      message: "Unable To Add Doctor",
    });
  }
};

const AllDoctors = async (req, res) => {
  try {
    const doctors = await DoctorModel.find().populate("userId");
    res.status(200).json({
      success: true,
      message: "Fetched all Doctors",
      doctors,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to load the doctors",
    });
  }
};
const DeleteDoctor = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteDoctor = await DoctorModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Doctor deleted Successfully",
      deleteDoctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to Delete Doctor",
    });
  }
};

const AllAppointments = async (req, res) => {
  try {
    const Appointments = await AppointmentModel.find()
      .populate("patientId")
      .populate("doctorId");

    return res.status(200).json({
      success: true,
      message: "Fetched all Appointments",
      Appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable tot fetch Appointments",
    });
  }
};

const patients = async (req, res) => {
  try {
    const patients = await AuthModel.find({ role: "patient" });

    return res.status(200).json({
      success: true,

      message: "Fetched all Patients",

      patients,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to load the Patients",
    });
  }
};

const AdminStats = async (req, res) => {
  try {
    // total doctors
    const totalDoctors = await DoctorModel.countDocuments();

    // total patients
    const totalPatients = await AuthModel.countDocuments({
      role: "patient",
    });

    // total appointments
    const totalAppointments = await AppointmentModel.countDocuments();

    // booked appointments
    const bookedAppointments = await AppointmentModel.countDocuments({
      status: "Booked",
    });

    // completed appointments
    const completedAppointments = await AppointmentModel.countDocuments({
      status: "Completed",
    });

    // cancelled appointments
    const cancelledAppointments = await AppointmentModel.countDocuments({
      status: "Cancelled",
    });

    return res.status(200).json({
      success: true,

      stats: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        bookedAppointments,
        completedAppointments,
        cancelledAppointments,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to Fetch Admin Stats",
    });
  }
};

module.exports = {
  AddDoctor,
  AllAppointments,
  AllDoctors,
  DeleteDoctor,
  patients,
  AdminStats,
};
