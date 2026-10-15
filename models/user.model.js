import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
   username:{
    type:String,
    required:[true,"Name is cannot be blank"],
    minLength:2,
    maxLength:50,
    trim:true
   },
   email:{
    type:String,
    required:[true,"Email is required"],
    unique:true,
     minLength:5,
    maxLength:250,
    trim:true
   },
   password:{
    type:String,
    required:true,
     minLength:5,
    maxLength:200,
   },
   role:{
      type:String,
      enum:["user","admin"],
      default:"user"
   }
},{timestamps:true});



export default mongoose.model("User",userSchema)