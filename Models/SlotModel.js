const mongoose=require("mongoose")

const SlotSchema=new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor"
    },
    date:{
        type:String,
        required:true
    },
        time:{
        type:String,
        required:true
    },
    isBooked:{
        type:Boolean,
        default:false
    }
})

const SlotModel=mongoose.model("Slot",SlotSchema)
module.exports=SlotModel