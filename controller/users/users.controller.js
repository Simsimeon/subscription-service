import { StatusCodes } from "http-status-codes";
import userModel from "../../models/user.model.js"
import NotFoundApiError from "../../errors/notfound.error.js";

export const getAllUser=async (req,res,next)=>{
   try{
   const users = await userModel.find();

   return res.status(StatusCodes.OK).json({
    success:true,
    data:users
   })
   }catch(error){
    next(error)
   }
}


export const getUserDetails = async (req,res,next)=>{
    try{
     const {id}=req.params
     const userDetails = await userModel.findById(id).select('-password');
      if(!userDetails){
        throw new NotFoundApiError("User not found")
      }
     return res.status(StatusCodes.OK).json({
        success:true,
        data:userDetails
     })
    }catch(error){
        next(error)
    }
}