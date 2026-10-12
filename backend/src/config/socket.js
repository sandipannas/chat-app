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

//for storing online users map of userID=>socketId
const userSocketMap= new Map();

export function getReceiverSocketId(userId){
   if(userSocketMap.has(userId)){
    return userSocketMap.get(userId);
   }
   else{
    console.log("user is not present in the map",userId)
    return null;
   }
}

function emitToUser(userId, event, payload) {
    const socketId = getReceiverSocketId(String(userId));

    if (socketId) {
        io.to(socketId).emit(event, payload);
    }
}



io.on("connection", (socket)=>{
    const userId=socket.handshake.query.userId;

    if(userId){ 
        userSocketMap.set(userId.toString(),socket.id)
    }

    io.emit("getOnlineUsers",[...userSocketMap.keys()]);

    socket.on("call:invite", ({ receiverId, callerName, callerPeerId }) => {
        emitToUser(receiverId, "call:incoming", {
            callerId: userId,
            callerName,
            callerPeerId,
        });
    });

    socket.on("call:accept", ({ callerId, receiverPeerId }) => {
        emitToUser(callerId, "call:accepted", {
            receiverId: userId,
            receiverPeerId,
        });
    });

    socket.on("call:reject", ({ callerId }) => {
        emitToUser(callerId, "call:rejected", { receiverId: userId });
    });

    socket.on("call:end", ({ otherUserId }) => {
        emitToUser(otherUserId, "call:ended", { receiverId: userId });
    });

    socket.on("disconnect",()=>{
        console.log("a user disconnected",socket.id)
        console.log("the user id before deleting",userSocketMap);
        userSocketMap.delete(userId.toString());
        io.emit("getOnlineUsers",[...userSocketMap.keys()]);
        console.log("the user id after deleting",userSocketMap);
    })
})

export {io , app , server};
