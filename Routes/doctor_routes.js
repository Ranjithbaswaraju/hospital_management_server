const express = require("express");
const {
  AddSlot,
  GetDoctorSlots,
  Appointments,
  UpdateAppointment,
  DoctorProfile,
} = require("../Controllers.js/doctor_controller");
const AuthMiddleWare = require("../MiddleWares/authmiddleware");
const checkRole = require("../MiddleWares/roleMiddleWare");
const router = express.Router();

router.post("/doctor/add-slot", AuthMiddleWare, checkRole("doctor"), AddSlot);
router.get("/doctor/slots", AuthMiddleWare, checkRole("doctor"), GetDoctorSlots);
router.get(
  "/doctor/appointments",
  AuthMiddleWare,
  checkRole("doctor"),
  Appointments,
);
router.put(
  "/doctor/update-status/:id",
  AuthMiddleWare,
  checkRole("doctor"),
  UpdateAppointment,
);
router.get(
   "/doctor/profile",
  AuthMiddleWare,
  checkRole("doctor"),
  DoctorProfile
)

module.exports = router;
