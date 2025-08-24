import Message from "../models/message.model.js"
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId , io } from "../config/socket.js";


export const getMessages = async(req,res)=>{
  const sender = req.user._id;
  

  try{
    if(!sender){
        return res.status(200).json({
        message:"bad request"
    })}

const allMessage = await Message.find({
    $or:[
    {senderId:sender},
    {receiverId:sender}
    ]
}).sort({createdAt:1})
    
    return res.status(201).json(allMessage);

  }
  catch(err){
    console.log("some error occured while fetchin all messages",err);
    return res.status(500).json({
        message:"internal server error"
    })
  }
}

export const sendMessage = async(req,res)=>{
    const {senderId,receiverId,text,image} = req.body;
    try{
        if(!senderId || !receiverId){
            return res.status(200).json({
                message:"bad request"
            })
        }

        
        // const uploadResponse = await cloudinary.uploader.upload(image);
        // const uploadUrl = uploadResponse.secure_url;

        const response = await Message.create({
            senderId:senderId,
            receiverId:receiverId,
            text,
            image : ""
        })

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){ // checks if the user is online , then sent the msg in realtime
            io.to(receiverSocketId).emit("newMessage",response);
        }
        


        if(response){
            return res.status(201).json(response);
        }
        else{
            return res.status(500).json({
                message:"internal server error"
            })
        }
    }
    catch(err){
        console.log("error occured while sending message",err);
        return res.status(500).json({
            message:"internal server error"
        })
    }
}