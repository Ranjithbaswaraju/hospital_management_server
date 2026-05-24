const AppointmentModel = require("../Models/AppointmentModel");
const SlotModel = require("../Models/SlotModel");
const AuthModel = require("../Models/AuthModel");
const DoctorModel = require("../Models/DoctorModel");
const { getDayFromDate, isPastDate } = require("../utils/dateHelper");
const {
  sendBookingConfirmationEmail,
  sendCancellationEmail,
} = require("../utils/sendEmail");

require("dotenv").config();

// BOOK APPOINTMENT
const BookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, reason } = req.body;

    // find slot
    const slot = await SlotModel.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: "Slot Not Available",
      });
    }

    // already booked
    if (slot.isBooked) {
      return res.status(400).json({
        success: false,
        message: "Slot Already Booked",
      });
    }

    // prevent past date booking
    if (isPastDate(slot.date)) {
      return res.status(400).json({
        success: false,
        message: "Cannot book appointments for past dates",
      });
    }

    // validate selected date matches slot day
    const selectedDay = getDayFromDate(slot.date);
    if (slot.days && slot.days.length > 0 && !slot.days.includes(selectedDay)) {
      return res.status(400).json({
        success: false,
        message: `Selected date (${selectedDay}) does not match doctor's available days`,
      });
    }

    // find doctor
    const doctor = await DoctorModel.findById(doctorId);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor Not Found",
      });
    }

    // find patient
    const patient = await AuthModel.findById(req.user.id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient Not Found",
      });
    }

    // create appointment
    const appointment = await AppointmentModel.create({
      patientId: req.user.id,
      doctorId,
      slotId,
      reason,
      status: "Booked",
    });

    // mark slot as booked
    slot.isBooked = true;
    await slot.save();

    // send confirmation email (must succeed before returning success)
    try {
      const doctorName = doctor.name || doctor.userId?.name || "Doctor";

      await sendBookingConfirmationEmail({
        patientEmail: patient.email,
        patientName: patient.name,
        doctorName,
        date: slot.date,
        time: slot.time,
        bookingId: appointment._id.toString(),
      });
    } catch (emailErr) {
      // rollback booking if email fails
      slot.isBooked = false;
      await slot.save();
      await AppointmentModel.findByIdAndDelete(appointment._id);

      console.log("EMAIL ERROR:", emailErr.message);

      return res.status(500).json({
        success: false,
        message: `Appointment booked but confirmation email failed: ${emailErr.message}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully. Confirmation email sent.",
      appointment,
    });
  } catch (err) {
    console.log("BOOK APPOINTMENT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Unable to book appointment",
    });
  }
};

// CANCEL APPOINTMENT
const CancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await AppointmentModel.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment Not Found",
      });
    }

    appointment.status = "Cancelled";
    await appointment.save();

    // free slot
    await SlotModel.findByIdAndUpdate(appointment.slotId, {
      isBooked: false,
    });

    const patient = await AuthModel.findById(appointment.patientId);

    // send cancellation email
    try {
      if (patient?.email) {
        await sendCancellationEmail({
          patientEmail: patient.email,
          patientName: patient.name,
        });
      }
    } catch (emailErr) {
      console.log("CANCEL EMAIL ERROR:", emailErr.message);
      // cancellation still succeeds even if email fails
    }

    return res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable To Cancel Appointment",
    });
  }
};

// MY APPOINTMENTS
const MyAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.find({
      patientId: req.user.id,
    })
      .populate({ path: "doctorId", populate: { path: "userId" } })
      .populate("slotId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My Appointments Fetched",
      appointments,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Unable To Load My Appointments",
    });
  }
};

module.exports = {
  BookAppointment,
  CancelAppointment,
  MyAppointments,
};
