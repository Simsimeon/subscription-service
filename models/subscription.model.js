import mongoose from "mongoose";


const subscriptionSchema= new mongoose.Schema({
name:{
    type:String,
    required:[true,"subscription name is required"],
    trim:true,
    minLength:2,
    maxLength:100
},
price:{
    type:Number,
    required:[true,"Subscription price is required"],
    min:[0,'Price must be greater than or equal to 0'],
},
currency:{
    type:String,
    enum:['USD','EUR','GBP'],
    default:'USD'
},
frequency:{
    type:String,
    enum:['daily','weekly','monthly','yearly'],
    required:[true,'Subscription frequency is required'],
},
category:{
    type:String,
    enum:['sport','news','entertainment','lifestyle','technology','finance','politics','other'],
    required:true
},
paymentMethod:{
    type:String,
    required:true,
    trim:true
},
status:{
    type:"String",
    enum:['active','cancelled','expired'],
    default:'active'
},
startDate:{
    type:Date,
    required:true,
    validate:{
        validator: (value) => {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        oneYearFromNow.setHours(23, 59, 59, 999);
        // Allows dates between today and 1 year in the future
        return value >= startOfToday && value <= oneYearFromNow;
    },
    message: 'Start date must be between today and one year from now.'
    }
},
renewalDate:{
    type:Date,
    required:true,
    validate:{
        validator: function(value) {
            const startDate = typeof this.get === 'function' ? this.get('startDate') : this.startDate;
            return startDate ? value > startDate : false;
        },
        message: 'The renewal date must be after the start date.'
    }
},
user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    }
},{timestamps:true}); 

subscriptionSchema.pre('validate',async function(){
    if(!this.renewalDate){
        const renewalPeriod={
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        }
        const daysToAdd = renewalPeriod[this.frequency] || 0;
        const calculatedDate = new Date(this.startDate);
        calculatedDate.setDate(calculatedDate.getDate() + daysToAdd);
    
         this.renewalDate = calculatedDate;
    }


    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }
})







export default mongoose.model("Subscription",subscriptionSchema);