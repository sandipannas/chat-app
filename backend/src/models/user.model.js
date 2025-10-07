import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        googleId: {
            type: String,
            unique: true
        },
        email: {
          type:String,
          required:true,
          unique:true
        },
        fullName: {
            type:String,
            required:true
        },
        password: {
            type:String,
            //required:true,
            //min:8
        },
        profilePicture: {
            type:String,
            default:""
        }
    },
    {timestamps: true}
);

const User = mongoose.model("User",userSchema);

export default User;