const DoctorModel = require("../Models/DoctorModel");
const SlotModel = require("../Models/SlotModel");
const { getDayFromDate, isPastDate } = require("../utils/dateHelper");

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
      singleDoctor,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to load the single doctors",
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

// Resolve doctor by Doctor _id or legacy Auth userId
const resolveDoctor = async (doctorId) => {
  let doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    doctor = await DoctorModel.findOne({ userId: doctorId });
  }
  return doctor;
};

// Get available slots for a doctor on a specific date (must match day of week)
const GetSlots = async (req, res) => {
  const { doctorId, date } = req.params;

  try {
    if (isPastDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Cannot view slots for past dates",
        slots: [],
      });
    }

    const doctor = await resolveDoctor(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
        slots: [],
      });
    }

    const dayOfWeek = getDayFromDate(date);

    const slots = await SlotModel.find({
      $or: [{ doctorId: doctor._id }, { doctorId: doctor.userId }],
      date,
      isBooked: false,
    });

    const matchedSlots = slots.filter((slot) => {
      if (!slot.days || slot.days.length === 0) return true;
      return slot.days.includes(dayOfWeek);
    });

    return res.status(200).json({
      success: true,
      selectedDate: date,
      selectedDay: dayOfWeek,
      doctorId: doctor._id,
      slots: matchedSlots,
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
