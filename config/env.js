import * as dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});


export const {JWT_EXPIRES_IN,PORT,NODE_ENV,MONGO_URI,JWT_SECRET,QSTASH_URL,QSTASH_TOKEN} =process.env;