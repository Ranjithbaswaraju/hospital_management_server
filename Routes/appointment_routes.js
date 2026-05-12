const express=require("express")
const { BookAppointment, CancelAppointment, MyAppointments } = require("../Controllers.js/appointment_contoller")
const AuthMiddleWare = require("../MiddleWares/authmiddleware")
const checkRole = require("../MiddleWares/roleMiddleWare")
const router=express.Router()

router.post("/appointment/book",AuthMiddleWare,checkRole("patient"),BookAppointment)
router.delete("/appointment/cancel/:id",AuthMiddleWare,checkRole("patient"),CancelAppointment)
router.get("/appointment/my-appointment",AuthMiddleWare,checkRole("patient"),MyAppointments)


module.exports=router