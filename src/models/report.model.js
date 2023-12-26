import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    //user to report
    reportedToUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //user who report
    reportByUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    reportType:{
        type:String,
        required:true
    },
    reportText:{
        type:String,
        required:true
    },
    attchedFile:{
        type:String
    }
})