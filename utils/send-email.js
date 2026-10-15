import dayjs from "dayjs";
import BadRequestError from "../errors/badRequest.error.js";
import NotFoundApiError from "../errors/notfound.error.js"
import { emailTemplates } from "./email-template.js";
import {transporter, accountEmail } from "../config/nodemailer.js";
import {CLIENT_URL, SERVER_URL } from "../config/env.js";

export const sendRemindersEmail= async({to,type,subscription})=>{
if(!to || !type) throw new NotFoundApiError("Missing required parameters");

const template = emailTemplates.find((t)=>t.label===type);


if(!template) throw new BadRequestError("Invalid email type");

const clientUrl = CLIENT_URL || SERVER_URL;
const mailInfo ={
    userName:subscription.user?.username,
    subscriptionName:subscription.name,
    renewalDate: dayjs(subscription.renewalDate).format("MMM D, YYYY"),
    planName:subscription.name,
    price:`${subscription.currency} ${subscription.price} (${subscription.frequency})`,
    paymentMethod:subscription.paymentMethod,
    accountSettingsLink:`${clientUrl}/settings`,
    supportLink:`${clientUrl}/support`,
}
 

const message = template.generateBody(mailInfo);
const subject = template.generateSubject(mailInfo)

const mailOptions ={
    from:accountEmail,
    to:to,
    subject:subject,
    html:message
};
const info = await transporter.sendMail(mailOptions);
console.log('Email sent: ' + info.response);
return info;
}