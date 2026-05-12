const AppointmentModel = require("../Models/AppointmentModel");
const SlotModel = require("../Models/SlotModel");

const BookAppointment = async (req, res) => {

  try {

    const { doctorId, slotId } = req.body;



    const slot = await SlotModel.findById(slotId);



    if (!slot) {

      return res.status(404).json({

        success: false,

        message: "Slot Not Available"

      });
    }



    if (slot.isBooked) {

      return res.status(400).json({

        success: false,

        message: "Slot Already Booked"

      });
    }



    const appointment = await AppointmentModel.create({

      patientId: req.user.id,

      doctorId,

      slotId,

      status: "Booked"

    });



    slot.isBooked = true;

    await slot.save();



    return res.status(201).json({

      success: true,

      message: "Appointment Booked Successfully",

      appointment

    });

  }

  catch (err) {

    console.log(err);

    return res.status(500).json({

      success: false,

      message: "Unable to Book Appointment"

    });
  }
};
const CancelAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const Appointment = await AppointmentModel.findById(id);

    if (!Appointment) {
      return res.status(500).json({
        success: true,
        message: "Appointment Not Found",
      });
    }

    Appointment.status = "Cancelled";
    await Appointment.save();

    await SlotModel.findByIdAndUpdate(Appointment.slotId, { isBooked: false });
    return res.status(200).json({
      success: true,

      message: "Appointment Cancelled Successfully",
    });
  } catch (err) {
    return res.json(500).json({
      success: false,
      message: "Unable to Cancel Appointment",
    });
  }
};
const MyAppointments = async(req, res) => {
  try {
    const appointments=await AppointmentModel.find({patientId:req.user.id})
    .populate("doctorId")
    .populate("slotId")

    return res.status(200).json({
        success:true,
        message:"My Appointments Fetched",
        appointments
    })
  } catch (err) {
    return res.json(500).json({
      success: false,
      message: "Unable to load my Appointments",
    });
  }
};

module.exports = { BookAppointment, CancelAppointment, MyAppointments };
