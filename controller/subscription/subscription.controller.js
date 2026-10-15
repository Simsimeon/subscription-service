import { StatusCodes } from "http-status-codes";
import subscriptionModel from "../../models/subscription.model.js"
import UnauthorizeError from "../../errors/unauthorize.error.js";
import NotFoundApiError from "../../errors/notfound.error.js";
import { WorkFlowClient } from "../../config/upstash.js";
import { SERVER_URL } from "../../config/env.js";


export const createSubscription = async(req,res,next)=>{
try{
    const subscription = await subscriptionModel.create({
        ...req.body,
        user:req.user.userId
    });
   const { workflowRunId } = await WorkFlowClient.trigger({
        url:`${SERVER_URL}/api/v1/workflow/subscription/remainder`,
        body:{
            subscriptionId:subscription.id
        },
        headers:{
           'content-type':'application/json',
        },
        retries:0,
    });
    return res.status(StatusCodes.CREATED).json({
        success:true,
        data:{subscription,workflowRunId}
    })

}catch(error){
  next(error)
}
}

export const getAllMySubscription =async(req,res,next)=>{
    try{

    
    const {id}=req.params;
    if(id!==req.user.userId){
        throw new UnauthorizeError("Not allowed")
    } 

    const mySubscriptions = await subscriptionModel.find({user:id});

    if(!mySubscriptions){
        throw new NotFoundApiError("Subscription not found");
    }
    return res.status(StatusCodes.OK).json({
        success:true,
        data:mySubscriptions
    })

}catch(error){
    next(error)
}
   
}