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
   if(userSocketMap.has(userId)){
    return userSocketMap.get(userId);
   }
   else{
    console.log("user is not present in the map",userId)
    return null;
   }
}

//for sotring online users
const userSocketMap= new Map();


io.on("connection", (socket)=>{
    console.log("a user concected",socket.id);
    console.log("the user id is",socket.handshake.query.userId);

    const userId=socket.handshake.query.userId;
    if(userId) { userSocketMap.set(userId.toString(),socket.id)}
    console.log("the user id after setting",userSocketMap);

    io.emit("getOnlineUsers",[...userSocketMap.keys()]);

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id)
        console.log("the user id before deleting",userSocketMap);
        userSocketMap.delete(userId.toString());
        io.emit("getOnlineUsers",[...userSocketMap.keys()]);
        console.log("the user id after deleting",userSocketMap);
    })
})

export {io , app , server};
