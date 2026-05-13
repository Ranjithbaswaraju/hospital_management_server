const AppointmentModel = require("../Models/AppointmentModel");
const SlotModel = require("../Models/SlotModel");
const AuthModel = require("../Models/AuthModel");
const DoctorModel = require("../Models/DoctorModel");

const nodemailer = require("nodemailer");

require("dotenv").config();

// transporter
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.USERMAIL,
    pass: process.env.EMAILPASS,
  },
});

console.log(process.env.USERMAIL);
console.log(process.env.EMAILPASS);
// BOOK APPOINTMENT
const BookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, reason } = req.body;

    console.log("DOCTOR ID :", doctorId);

    console.log("SLOT ID :", slotId);

    console.log("BOOK USER :", req.user.id);

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

    // find doctor
    const doctor = await DoctorModel.findById(doctorId);

console.log("doctor:", doctor);

    console.log("DOCTOR :", doctor);

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

    console.log("APPOINTMENT :", appointment);

    // update slot
    slot.isBooked = true;

    await slot.save();

    // send success response immediately
    res.status(201).json({
      success: true,
      message: "Appointment Booked Successfully",
      appointment,
    });

    await transporter.sendMail({
        from: process.env.USERMAIL,
        to: patient.email,
        subject: "Appointment Booked Successfully",
        html: `<div style="font-family: Arial, sans-serif; padding:20px;">
      <h1 style="color:green;">Appointment Confirmed ✅</h1>

      <p>Hello ${patient.name},</p>

      <p>Your appointment has been booked successfully.</p>

      <h3>Appointment Details:</h3>

      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <td style="border:1px solid #ddd; padding:8px;"><b>Doctor Name</b></td>
          <td style="border:1px solid #ddd; padding:8px;">
            ${doctor?.name}
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #ddd; padding:8px;"><b>Specialization</b></td>
          <td style="border:1px solid #ddd; padding:8px;">
            ${doctor.specialization}
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #ddd; padding:8px;"><b>Date</b></td>
          <td style="border:1px solid #ddd; padding:8px;">
            ${slot.date}
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #ddd; padding:8px;"><b>Time</b></td>
          <td style="border:1px solid #ddd; padding:8px;">
            ${slot.time}
          </td>
        </tr>

        <tr>
          <td style="border:1px solid #ddd; padding:8px;"><b>Consultation Fee</b></td>
          <td style="border:1px solid #ddd; padding:8px;">
            ₹${doctor.fees}
          </td>
        </tr>
      </table>

      <br/>

      <p>Thank you for choosing our hospital.</p>
    </div>
  `,
      })
      .then((info) => {
        console.log("MAIL SENT SUCCESSFULLY");

        console.log(info);
      })
      .catch((err) => {
        console.log("MAIL ERROR :", err);
      });
    console.log("PATIENT EMAIL :", patient.email);
  } catch (err) {
    console.log("BOOK APPOINTMENT ERROR :", err);

    return res.status(500).json({
      success: false,
      message: err.message,
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

    // patient
    const patient = await AuthModel.findById(appointment.patientId);

    // send response
    res.status(200).json({
      success: true,
      message: "Appointment Cancelled Successfully",
    });

    // send cancel mail
    transporter
      .sendMail({
        from: process.env.USERMAIL,

        to: patient.email,

        subject: "Appointment Cancelled",

        html: `
        <h1 style="color:red">
          Appointment Cancelled ❌
        </h1>

        <p>
          Your appointment has been cancelled successfully.
        </p>
      `,
      })
      .then(() => {
        console.log("CANCEL MAIL SENT");
      })
      .catch((err) => {
        console.log("MAIL ERROR :", err);
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
    console.log("FETCH USER :", req.user.id);

    const appointments = await AppointmentModel.find({
      patientId: req.user.id,
    })
      .populate("doctorId")
      .populate("slotId");

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
