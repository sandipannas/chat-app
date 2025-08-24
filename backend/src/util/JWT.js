import jwt from 'jsonwebtoken'

export const generateJWT = (userId,res)=>{
  
    const token = jwt.sign({userId},process.env.JWT_PASSWORD,{
        expiresIn:"7d"
    })
    
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true, //prevent XSS attacks cross-site scripting attacks
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // "none" required for cross-origin
        secure: process.env.NODE_ENV !== "development", // Must be true with sameSite: "none"
        path: "/" // Ensure cookie is available for all paths
    });

    return token;
}

