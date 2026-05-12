const express=require("express")
const { Doctors, SingleDoctor, FilterDoctor } = require("../Controllers.js/patient_controller")
const AuthMiddleWare = require("../MiddleWares/authmiddleware")
const checkRole = require("../MiddleWares/roleMiddleWare")
const router=express.Router()

router.get("/patient/doctors",AuthMiddleWare,checkRole("patient"),Doctors)
router.get("/patient/doctors/:id",AuthMiddleWare,checkRole("patient"),SingleDoctor)
router.get("/patient/specialization/:type",AuthMiddleWare,checkRole("patient"),FilterDoctor)

module.exports=router;