import { StatusCodes } from "http-status-codes"
import UnauthenticatedError from "../errors/unauthenticated.error.js"
import UnauthorizeError from "../errors/unauthorize.error.js"
import { verifyToken } from "../utils/createUserToken.js"

 export const authUserMiddleware = async (req,res,next)=>{
    try{

    const token = req.signedCookies.token
    console.log(token);
    
   if(!token){
    throw new UnauthenticatedError('user is not authenticated')
   }
   const payload = await verifyToken(token);
   
   if(!payload){
    throw new UnauthenticatedError('user is not authenticated')
   }
   console.log(payload);
   
   const { userId, username,email, role}  = payload
    req.user = { userId, username,email, role}
    next()
}catch(err){
    next(err)
 
}
}

 export const permission =(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        throw new UnauthorizeError("Request Denied")
    }
    next()
  }
 }