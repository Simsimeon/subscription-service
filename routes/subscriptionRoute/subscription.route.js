import { Router } from "express";


const subscriptionRouter = Router();


subscriptionRouter.get('/',(req,res)=>res.send({
    msg:"Get all subscriptions"
}));
subscriptionRouter.get('/upcoming-renewals',(req,res)=>res.send({
    msg:"Get upcoming renewals"
}));
subscriptionRouter.get('/user/:id',(req,res)=>res.send({
    msg:"Get all user subscriptions"
}));
subscriptionRouter.get('/:id',(req,res)=>res.send({
    msg:"Get subscriptions details"
}));
subscriptionRouter.post('/create',(req,res)=>res.send({
    msg:"Create subscriptions"
}));
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