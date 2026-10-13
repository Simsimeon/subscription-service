import express from 'express';
import { PORT,MONGO_URI,JWT_SECRET } from './config/env.js';
import userRouter from './routes/userRoutes/user.route.js';
import subscriptionRouter from './routes/subscriptionRoute/subscription.route.js';
import authRouter from './routes/authRoute/auth.route.js';
import connectDB from './db/db.js';
import errorHandlerMiddleware from './middleware/error-handler.middleware.js';
import notFoundRoute from './middleware/notFoundRoutes.js';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  statusCode: StatusCodes.TOO_MANY_REQUESTS, 
  message: {
    success: false,
    message: 'Too many login or registration attempts from this IP. Please try again after 15 minutes.'
  },
})

const app =express();
// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser(JWT_SECRET));


app.use(authLimiter);

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/subscribe",subscriptionRouter);







app.use(notFoundRoute);
app.use(errorHandlerMiddleware);

const startServer = async ()=>{
   try{
       app.listen(PORT,async()=>{
        await  connectDB(MONGO_URI);
        console.log(`This server is running on port ${PORT} and the database is connected`);
       });

   }catch(error){
    console.log('error starting server',error.message);
    
   }
};

startServer()