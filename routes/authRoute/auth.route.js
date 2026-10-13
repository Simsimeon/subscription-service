import { Router } from "express";
import { logout, signIn, signUp } from "../../controller/auth/auth.controller.js";
import validateRegisterUser from "../../middleware/validate-input.middleware.js";
const authRouter =Router();


authRouter.post('/sign-up',validateRegisterUser,signUp);
authRouter.post('/sign-in',signIn);
authRouter.post('/logout',logout);



export default authRouter;