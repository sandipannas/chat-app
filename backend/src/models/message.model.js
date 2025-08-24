import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    senderId:{
        type:String,
        required:true,
    },
    receiverId:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true,
        min:1
    },
    image:{
        type:String,
        default:""
    }
},
{timestamps: true}
);

const Message = mongoose.model("Message",messageSchema);

export default Message;
