import { Router } from "express";
import { getAllUser, getUserDetails } from "../../controller/users/users.controller.js";
import { authUserMiddleware } from "../../middleware/auth.js";


const userRouter = Router();


userRouter.get('/',authUserMiddleware,getAllUser);
userRouter.get('/:id',getUserDetails);
userRouter.post('/',(req,res )=> res.send({msg:"User created Successfully"}));
userRouter.put('/:id',(req,res )=> res.send({msg:"User updated successfully"}));
userRouter.delete('/',(req,res )=> res.send({msg:"User deleted successfully"}));


export default userRouter;