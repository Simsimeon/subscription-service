import jwt from "jsonwebtoken"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"

 export const createUserPayload=(user)=>{
    return{
     userId:user._id,
     username:user.username,
     email:user.email,
     role:user.role
    }
}

const generateTokenForUser=({payload})=>{
 const token = jwt.sign(payload,JWT_SECRET,{
    expiresIn:JWT_EXPIRES_IN
 })
return token
}

 export const verifyToken = async(token)=> await jwt.verify(token,JWT_SECRET)
export function attachCookiesToResponse({res,user}){
    const userToken = generateTokenForUser({payload:user});
    res.cookie('token',userToken,{
        httpOnly:true,
        secure: process.env.NODE_ENV === "production", 
        signed:true,
        maxAge: 7 * 24 * 60 * 60 * 1000 ,
         sameSite: process.env.NODE_ENV === "production" ? 'lax' : 'lax' 
    })

}


