import mongoose from "mongoose"
import userModel from "../../models/user.model.js";
import BadRequestError from "../../errors/badRequest.error.js";
import { StatusCodes } from "http-status-codes";
import { genSalt } from "bcryptjs";
import bcrypt from "bcryptjs";
import {createUserPayload, attachCookiesToResponse } from "../../utils/createUserToken.js";
import NotFoundApiError from "../../errors/notfound.error.js";
import UnauthenticatedError from "../../errors/unauthenticated.error.js";


export const signUp= async (req ,res,next)=>{
 const session = await mongoose.startSession();
  session.startTransaction();
  try{
    const {username,email,password}=req.body;


    // checking for existing user
    const existingUser = await userModel.findOne({ email }).session(session);
    if(existingUser){
        throw new BadRequestError("User all ready exist");
    }
     const salt = await genSalt(10);
     const hashPassword = await bcrypt.hash(password,salt)
     const isFirstAccount = (await userModel.countDocuments({})) ===0;
    const role = isFirstAccount ? 'admin' :'user'
    const newUser = await userModel.create([{username,email,password:hashPassword,role}],{session});
     const userDoc = Array.isArray(newUser) ? newUser[0] : newUser;
     const cleanUserObj = userDoc.toObject();
    
    
    const userToken= createUserPayload(cleanUserObj);
     attachCookiesToResponse({res,user:userToken})
     await session.commitTransaction();
     return res.status(StatusCodes.CREATED).json({
      success:true,
      message:'User created successfully',
      data:userToken

    })




  } catch(error){
   if (session.inTransaction()) {
      await session.abortTransaction();
    }
    next(error)
  } finally{
     await session.endSession();
  }     



}
export const signIn= async (req ,res,next)=>{
try{
    const {email,password}=req.body;
const user = await userModel.findOne({email});
if(!user){
    throw new NotFoundApiError("User not found");

}
const matchPassword = await bcrypt.compare(password,user.password);
if(!matchPassword){
 throw new UnauthenticatedError("wrong email or password")
}
 
const cleanUser = typeof user.toObject === 'function' ? user.toObject() : user;
 const userToken = createUserPayload(cleanUser);

attachCookiesToResponse({res,user:userToken});
res.status(StatusCodes.OK).json({
    success:true,
    message:"User login successfully",
    data:userToken
})
}catch(error){
 
    next(error)
}
}
export const logout= async (req ,res)=>{
 res.cookie('token',{
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
      signed: true,
      expires: new Date(Date.now()), 
    sameSite: 'lax'
})
return res.status(StatusCodes.OK).json({
       success: true,
      message: "User logged out successfully"
})
}