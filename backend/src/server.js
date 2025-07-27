import dotenv from "dotenv"
import express from "express";
import userRoutes from "./routes/user.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./config/db.js"
import cookieParser from "cookie-parser";

dotenv.config()

const app=express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/user",userRoutes)
app.use("/api/message",messageRoutes)

app.listen(process.env.PORT,()=>{
    console.log("the serve is running");
    connectDB();
})