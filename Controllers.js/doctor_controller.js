const AppointmentModel = require("../Models/AppointmentModel");
const SlotModel = require("../Models/SlotModel");

// Add Slot With Automatic 30-Min Split
const AddSlot = async (req, res) => {
  // console.log(req.body);
  const { doctorId, date, startTime, endTime, days } = req.body;

  try {
    // convert into date objects
    let current = new Date(`${date}T${startTime}`);

    let end = new Date(`${date}T${endTime}`);

    let slots = [];

    // loop until end time
    while (current < end) {
      // format time
      let formattedTime = current.toLocaleTimeString("en-US", {
        hour: "2-digit",

        minute: "2-digit",

        hour12: true,
      });

      // save slot
      const slot = await SlotModel.create({
        doctorId,

        date,

        time: formattedTime,

        days,
      });

      slots.push(slot);

      // add 30 mins
      current.setMinutes(current.getMinutes() + 30);
    }

    return res.status(200).json({
      success: true,
      message: "Slots Added Successfully",
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

// Get All Appointments
const Appointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find();

    return res.status(200).json({
      success: true,
      message: "Fetched all Appointments",
      appointments,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to Load the Appointments",
    });
  }
};

// Update Appointment Status
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

// controller/doctorController.js

const DoctorModel = require("../Models/DoctorModel");

const DoctorProfile = async (req, res) => {
  try {

    const doctor =
      await DoctorModel.findOne({
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
      message:
        "Unable To Fetch Profile",
    });
  }
};


module.exports = {
  AddSlot,
  Appointments,
  UpdateAppointment,
  DoctorProfile
};
