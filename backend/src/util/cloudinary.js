import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";


const uploadOnCloudinary = ( fileBuffer , folderName ) =>{
    return new Promise((resolve,reject)=>{
       //uploding the buffer using upload_stream
       const uploadstream = cloudinary.uploader.upload_stream(
         {
             folder: folderName,
             resource_type:"auto",
         },
         (error,result)=>{
             if(error){
                 console.log("error occured while uploading file",error);
                 reject(error);
             }
             else{
                 console.log("file uploaded successfully",result);
                 resolve(result);
             }
         }
       );
 
       //converting the buffer to stream
       streamifier.createReadStream(fileBuffer).pipe(uploadstream);
    })
 }
 
 export {uploadOnCloudinary};