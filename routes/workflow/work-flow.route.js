import { Router } from "express";
import { sendReminders } from "../../controller/workflow/workflow.controller.js";


const workFlowRouter = Router();


workFlowRouter.post("/subscription/remainder",sendReminders)

export default workFlowRouter;