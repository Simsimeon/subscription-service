import {createRequire} from "module";
import subscriptionModel from "../../models/subscription.model.js";
const require = createRequire(import.meta.url);
const {serve} = require("@upstash/workflow/express");
import dayjs from "dayjs";
import { sendRemindersEmail } from "../../utils/send-email.js";
import { reminderLabel } from "../../utils/email-template.js";

const REMINDERS=[7,5,2,1];
export const sendReminders= serve(async(context)=>{
    const {subscriptionId}= context.requestPayload;
    const subscription = await fetchSubscription(context,subscriptionId)
if(!subscription || subscription.status !== 'active') return
  const renewalDate = dayjs(subscription.renewalDate);
  if(renewalDate.isBefore(dayjs())){
   console.log(`Renewal date has pass for this subscription with id ${subscriptionId}`);
   return   
  }
  for (const daysBefore of REMINDERS){
    const reminderDate = renewalDate.subtract(daysBefore,'day')

    // reminders whose window has already passed are skipped, not sent late
    if(!reminderDate.isAfter(dayjs())) continue;
     
    const label = reminderLabel(daysBefore);
    await sleepUtilReminder(context,label,reminderDate)
    if(dayjs.isSame(reminderDate,'day'));{
       await triggerReminder(context,label,subscription);
    }
  }
});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return await subscriptionModel
            .findById(subscriptionId)
            .populate({ path: 'user', select: 'username email' });
    });
};

const sleepUtilReminder = async (context,label,date)=>{
    console.log(`Sleeping until ${label} reminder at ${date}`);

    await context.sleepUntil(label,date.toDate());
    
}


const triggerReminder = async (context,label,subscription)=>{
    return await context.run(label,async()=>{
        console.log(`Triggering ${label} reminder`);
       await sendRemindersEmail({
        to:subscription.user.email,
        type:label,
        subscription,
       }) 
    })
}