import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    clerkId:{type:String, unique:true,required:true},
    name:{type:String, required:true},
    email:{type:String, unique:true, required:true},
    location:{
        type:{ type:String, enum:['Point'], default:'Point'},
        coordinates: {type: [Number], default:[0,0]}
    },
    role:{type:String, enum:['user','admin'], default:'user'}
}, {timestamps:true});

//Creating a geospatial index for location based queries
userSchema.index({location:'2dsphere'});

const User = mongoose.model("User",userSchema);

export default User;