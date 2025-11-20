import mongoose from "mongoose"

const waterReportSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    location:{
        type:{type:String, enum:['Point'], default:'Point'},
        coordinates:{type:[Number], required:true}// longitude and latitude 
    },
    waterAvailable:{type:Boolean, required:true},
    waterClean:{type:Boolean, required:true},
    description:{type:String, default:''},
    verified:{type:Boolean, default:false},//Admin is the one to verify
    timestamp:{type:Date, default:Date.now}
},{timestamps:true});

// Geospatial index for "find reports near me" queries
waterReportSchema.index({location:'2dsphere'});

const WaterReport =mongoose.model('WaterReport', waterReportSchema); 

export default WaterReport