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
    minLength:[0,'Price must be greater than 0'],
},
currency:{
    type:String,
    enum:['USD','EUR','GBP'],
    default:'USD'
},
frequency:{
    type:String,
    enum:['daily','weekly','monthly','yearly'],
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
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        // Allows dates between now and 1 year in the future
        return value >= new Date() && value <= oneYearFromNow;
    },
    message: 'Start date must be between today and one year from now.'
    },
    renewalDate:{
      type:Date,
      required:true,
       validator: function(value) {
        const startDate = typeof this.get === 'function' ? this.get('startDate') : this.startDate;
        return startDate ? value > startDate : false;
      },
      message: 'The renewable date must be after the start date.'
      
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
        index:true
    }
}
},{timestamps:true}); 

subscriptionSchema.pre('save',function(next){
    if(!this.renewableDate){
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
    next();
})







export default mongoose.model("Subscription",subscriptionSchema);