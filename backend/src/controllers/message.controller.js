import Message from "../models/massage.model.js"
import cloudinary from "../config/cloudinary.js";

export const getMessages = async(req,res)=>{
  const senderId = req.body.senderId;
  const receiverId = req.body.receiverId; 
  

  try{
    if(!senderId || !receiverId){
        return res.status(400).json({
        message:"bad request"
    })}

    const allMessage = await Message.find({
        senderId:senderId,
        receiverId:receiverId
    })

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
    const {senderId,receiverId,text,image} = req.body;

    try{
        if(!senderId || !receiverId){
            return res.status(200).json({
                message:"bad request"
            })
        }

        
        const uploadResponse = await cloudinary.uploader.upload(image);
        const uploadUrl = uploadResponse.secure_url;
        
        const response = await Message.create({
            senderId,
            receiverId,
            text,
            image : uploadUrl
        })


        if(response){
            return res.status(200).json(response);
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