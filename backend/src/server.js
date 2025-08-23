import dotenv from "dotenv"
import express from "express";
import userRoutes from "./routes/user.route.js"
import messageRoutes from "./routes/message.route.js"
import {connectDB} from "./config/db.js"
import {app,server} from "./config/socket.js"
import cookieParser from "cookie-parser"
import cors from "cors";

dotenv.config()

app.use(express.json());
app.use(cookieParser());


// CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',  // frontend URL
  credentials: true                // allow cookies to be sent
}));

app.get("/",(req,res)=>{
    res.send("API is running successfully");
})
app.use("/api/auth",userRoutes)
app.use("/api/message",messageRoutes)

server.listen(process.env.PORT,()=>{
    console.log(`the server is running on ${process.env.PORT}`);
    connectDB();
})