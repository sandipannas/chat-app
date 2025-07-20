import mongoose from "mongoose"

export const connectDB= async()=>{
    try{
        const db = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to the database : ${db.connection.host}`);
    }
    catch(error){
        console.log("problem occured while connecting to the database",error);
    }
};