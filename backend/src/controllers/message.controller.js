import Message from "../models/message.model.js"
import cloudinary from "../config/cloudinary.js";
import { getReceiverSocketId , io } from "../config/socket.js";


export const getMessages = async(req,res)=>{
  const userId = req.user._id;
  const { otherUserId } = req.query;

  try{
    if(!otherUserId){
        return res.status(400).json({
        message:"Other user ID is required"
    })
    }

const allMessage = await Message.find({
    $or:[
    {senderId:userId, receiverId:otherUserId},
    {senderId:otherUserId, receiverId:userId}
    ]
}).sort({createdAt:1})
    
   // console.log("Debug - found messages:", allMessage.length);
    return res.status(200).json(allMessage);

  }
  catch(err){
    console.log("some error occured while fetchin all messages",err);
    return res.status(500).json({
        message:"internal server error"
    })
  }
}

export const sendMessage = async(req,res)=>{
    const {receiverId,text,image} = req.body;
    const senderId = req.user._id; // Get sender from authenticated user
    try{
        if(!receiverId || !text){
            return res.status(400).json({
                message:"Receiver ID and message text are required"
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

        const receiverSocketId = getReceiverSocketId(receiverId.toString());
        console.log("receiverSocketId",receiverSocketId);
        if(receiverSocketId){ // checks if the user is online , then sent the msg in realtime
            io.to(receiverSocketId).emit("newMessage",response);
            console.log("new message sent successfully",response)
        }
        else{
            console.log("user is not online",receiverId);
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