const AppointmentModel = require("../Models/AppointmentModel");
const SlotModel = require("../Models/SlotModel");
const DoctorModel = require("../Models/DoctorModel");
const { getDayFromDate, isPastDate } = require("../utils/dateHelper");

// Resolve logged-in doctor document
const getDoctorByUserId = async (userId) =>
  DoctorModel.findOne({ userId }).populate("userId");

// Add Slot With Automatic 30-Min Split (always uses Doctor document _id)
const AddSlot = async (req, res) => {
  const { date, startTime, endTime, days } = req.body;

  try {
    const doctor = await getDoctorByUserId(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    if (isPastDate(date)) {
      return res.status(400).json({
        success: false,
        message: "Cannot add slots for past dates",
      });
    }

    const dateDay = getDayFromDate(date);
    if (days && days.length > 0 && !days.includes(dateDay)) {
      return res.status(400).json({
        success: false,
        message: `Date falls on ${dateDay} but ${dateDay} is not in your working days`,
      });
    }

    let current = new Date(`${date}T${startTime}`);
    let end = new Date(`${date}T${endTime}`);
    const slots = [];

    while (current < end) {
      const formattedTime = current.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const slot = await SlotModel.create({
        doctorId: doctor._id,
        date,
        time: formattedTime,
        days,
      });

      slots.push(slot);
      current.setMinutes(current.getMinutes() + 30);
    }

    return res.status(200).json({
      success: true,
      message: "Slots Added Successfully",
      selectedDay: dateDay,
      doctorId: doctor._id,
      slots,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to add slots",
    });
  }
};

// All slots for logged-in doctor (optional date filter)
const GetDoctorSlots = async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
        slots: [],
      });
    }

    const query = {
      $or: [{ doctorId: doctor._id }, { doctorId: doctor.userId }],
    };

    if (req.query.date) {
      query.date = req.query.date;
    }

    const slots = await SlotModel.find(query).sort({ date: 1, time: 1 });

    return res.status(200).json({
      success: true,
      message: "Doctor slots fetched",
      slots,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch slots",
      slots: [],
    });
  }
};

const Appointments = async (req, res) => {
  try {
    const doctor = await getDoctorByUserId(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
        appointments: [],
      });
    }

    const appointments = await AppointmentModel.find({
      $or: [{ doctorId: doctor._id }, { doctorId: doctor.userId?._id || doctor.userId }],
    })
      .populate("patientId")
      .populate("slotId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Fetched doctor appointments",
      appointments,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to Load the Appointments",
    });
  }
};

const UpdateAppointment = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  try {
    const updateAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Appointment Status Updated Successfully",
      updateAppointment,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to Update the Status",
    });
  }
};

const DoctorProfile = async (req, res) => {
  try {
    const doctor = await DoctorModel.findOne({
      userId: req.user.id,
    }).populate("userId");

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor Profile Fetched",
      doctor,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable To Fetch Profile",
    });
  }
};

module.exports = {
  AddSlot,
  GetDoctorSlots,
  Appointments,
  UpdateAppointment,
  DoctorProfile,
};
