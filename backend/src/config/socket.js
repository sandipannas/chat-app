import { Server } from "socket.io";
import http from "http";
import express from "express"
import dotenv from "dotenv"
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors: {
        origin:[
            process.env.PUBLIC_FRONTEND_URI,
            process.env.LOCAL_FRONTEND_URI
        ],
        credentials:true
    }
})

export function getReceiverSocketId(userId){
   return userSocketMap[userId];
}

//for sotring online users
const userSocketMap={};


io.on("connection", (socket)=>{
    console.log("a user concected",socket.id);

    const userId=socket.handshake.query.userId;
    if(userId) { userSocketMap[userId]=socket.id}

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id)
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})

export {io , app , server};
