const mongoose=require("mongoose")


const AppointmentSchema=new mongoose.Schema({
    patientId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor'
    },
    slotId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Slot"
    },
    status:{
        type:String,
        enum:["Booked","Completed","Cancelled"],
        default:"Booked"
    },
    note:{
        type:String
    }
},{timestamps:true})

const AppointmentModel=mongoose.model("appointment",AppointmentSchema)
module.exports=AppointmentModel