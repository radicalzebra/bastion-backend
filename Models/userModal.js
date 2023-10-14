const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

   //general
   username : {
      type: String,
      required : [true, "Please provide your name"],
      unique:true,
      trim:true,
      maxLength:[20,"username should be less than 20 characters long"]
   },

   email : {
      type: String,
      required : [true, "Please provide your email"],
      validate : [validator.isEmail,"Please provide correct email"],
      unique:true,
      trim:true,
      lowercase:true
   },

   password:{
      type:String,
      required : [true, "Please provide a password"],
      trim:true,
      minLength:7,
      select:false
   },

   passwordConfirm:{
     type:String,
     required : [true, "Please provide a password"],
     trim:true,
     validate:{
         validator:function(val) {
            return this.password === val
         },

         message:"Passwords are not the same!"
     }
   },

   phone : {
      type:Number,
      validate:[validator.isMobilePhone, "Please enter a valid credit card number"]
   },

   gender: {
      type: String,
      required : [true, "Please provide your gender"],
      enum: {
         values:["man", "woman"],
         message:"Please enter valid gender"
      }
   },

   photo : {
      type: String,
      default:"defaultUserPic.jpg"
   },

   role:{
      type:String,
      enum:["admin","seller","user"],
      default:"user"
   },


   //products
   //cart
   // purchased
   //notifications




   //card details 👇🏻
   cardName : {
      type: String,
   },

   cardExpiry :  Date,

   cardNumber : {
     type: Number,
     validate:[validator.isCreditCard, "Please enter a valid credit card number"]
   },

   cardCvv : Number,





   //address details 👇🏻
   streetAddress : String,

   city : String,

   landmark : String,

   state : String,

   pincode : {
      type:Number,
      validate:[validator.isPostalCode, "Please enter a valid pincode"]
   }

});



userSchema.pre("save", async function(next) {

   if(!this.isModified("password")) next() 

   this.password = await  bcrypt.hash(this.password,11)

   this.passwordConfirm = undefined;

   next();
})


userSchema.methods.correctPassword = async function (userPass,docPass) {
   
   return await bcrypt.compare(userPass,docPass);
}

const User = mongoose.model("Users",userSchema)

module.exports = User;