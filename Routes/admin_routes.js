const express=require("express")
const { AddDoctor, AllDoctors, DeleteDoctor, AllAppointments } = require("../Controllers.js/admin_controller")
const AuthMiddleWare = require("../MiddleWares/authmiddleware")
const checkRole = require("../MiddleWares/roleMiddleWare")
const router=express.Router()

router.post("/admin/add-doctor",AuthMiddleWare,checkRole("admin"),AddDoctor)
router.get("/admin/doctors",AuthMiddleWare,checkRole("admin"),AllDoctors)
// router.put("/admin/update-doctor/id")
router.delete("/admin/delete-doctor/:id",AuthMiddleWare,checkRole("admin"),DeleteDoctor)
router.get("/admin/appointments",AuthMiddleWare,checkRole("admin"),AllAppointments)


module.exports=router