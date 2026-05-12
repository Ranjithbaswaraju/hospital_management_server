const AppointmentModel = require("../Models/AppointmentModel")
const SlotModel = require("../Models/SlotModel")


const AddSlot=async(req,res)=>{
    const {doctorId,date,time}=req.body
    try{
        const Slot=await  SlotModel.create({
            doctorId,
            date,
            time
        })

    return res.status(200).json({
        success:true,
        message:"Slot Added Successfully",
        Slot
    })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to add slot"   
        })
    }
}
const Appointments=async(req,res)=>{
    try{
        const appointments=await AppointmentModel.find()
        return res.status(200).json({
            success:true,
            message:"Fetched all Appointments",
            appointments
        })
    }
    catch(err){
        return res.status(500).json({
          success:"Unable to Load the Appointments"  
        })
    }
}
const UpdateAppointment=async(req,res)=>{
    const {status}=req.body
    const id=req.params.id
    try{
        const updateAppointment=await AppointmentModel.findByIdAndDelete(id,{status},{new:true})
        res.status(200).json({
            success:true,
            message:"Appointment Status Updated Successfully"
        })
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to Update the Status"
        })
    }
}

module.exports={AddSlot,Appointments,UpdateAppointment}