import { Router } from "express";
import { createSubscription, getAllMySubscription } from "../../controller/subscription/subscription.controller.js";
import { authUserMiddleware } from "../../middleware/auth.js";


const subscriptionRouter = Router();


subscriptionRouter.get('/:id',authUserMiddleware,getAllMySubscription);
subscriptionRouter.get('/upcoming-renewals',(req,res)=>res.send({
    msg:"Get upcoming renewals"
}));
subscriptionRouter.get('/user/:id',(req,res)=>res.send({
    msg:"Get all user subscriptions"
}));
subscriptionRouter.get('/details/:id',(req,res)=>res.send({
    msg:"Get subscriptions details"
}));





subscriptionRouter.post('/create',authUserMiddleware,createSubscription);




subscriptionRouter.put('/:id',(req,res)=>res.send({
    msg:"update subscriptions"
}));
subscriptionRouter.put('/cancel/:id',(req,res)=>res.send({
    msg:"cancel user subscriptions"
}));
subscriptionRouter.delete('/',(req,res)=>res.send({
    msg:"Delete subscriptions"
}));


export default subscriptionRouter;