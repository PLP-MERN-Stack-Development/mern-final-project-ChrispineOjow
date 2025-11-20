import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB(){

    try{

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database has been connected");

    }catch(error){

        console.error(`Database connection failed`, error);

    }
}
