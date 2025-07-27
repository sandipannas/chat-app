import mongoose from 'mongoose';

const massageSchema = new mongoose.Schema({
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
        requrired:true,
        min:1
    },
    image:{
        type:String,
        default:""
    }
},
{timestamps: true}
);

const Massage = mongoose.model("Massage",massageSchema);

export default Massage;
