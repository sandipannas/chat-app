import jwt from 'jsonwebtoken'

export const generateJWT = (userId,res)=>{
  
    const token = jwt.sign({userId},process.env.JWT_PASSWORD,{
        expiresIn:"7d"
    })
    
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true, //prevent XSS attacks cross-site scripting attacks
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none", // Use "lax" for development
        secure: process.env.NODE_ENV !== "development", // Only secure in production
        domain: process.env.NODE_ENV === "development" ? "localhost" : undefined // No domain restriction in production
    });

    return token;
}

