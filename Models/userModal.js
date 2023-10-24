const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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


   passwordChangedAt: Date,
   passwordResetToken: String,
   passwordResetTokenExpires: Date,

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

   birthday:Date,

   role:{
      type:String,
      enum:["admin","seller","user"],
      default:"user"
   },

   sellerRating: {
      type:Number,
      validate:{
         validator:function(val) {
            return this.role === "seller" && this.val <= 5
         },

         message:"User must be seller & the rating should be less than or equal to 5"
      }
   },

   createdAt: {
      type:Date,
      default:Date.now()
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

   Cvv : Number,





   //address details 👇🏻
   streetAddress : String,

   city : String,

   landmark : String,

   state : String,

   pincode : {
      type:Number,
      validate:[validator.isPostalCode, "Please enter a valid pincode"]
   },


   active : {
      type : Boolean,
      default: true
   }

},{
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
});


//virtual populate
userSchema.virtual("reviews",{
   ref:"Reviews",
   foreignField: "user",
   localField: "_id"
})



userSchema.pre("save", async function(next) {

   if(!this.isModified("password")) next() 

   this.password = await  bcrypt.hash(this.password,11)

   this.passwordConfirm = undefined;

   next();
})


userSchema.pre(/^find/, function(next) {
   this.find({active:{$ne:false}});

   next();
})


userSchema.methods.correctPassword = async function (userPass,docPass) {

   return await bcrypt.compare(userPass,docPass);
}


userSchema.methods.changedPasswordAfter =  function (JWTTimestamp) {
   
   if(this.passwordChangedAt) {
     const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);

     return JWTTimestamp < changedTimestamp;
   }
   
   return false
}


userSchema.methods.createPasswordResetToken =  function () {

   const resetToken = crypto.randomBytes(32).toString("hex");


   this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

   this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

   return resetToken;
}


userSchema.methods.checkPwd = async function(inputPwd, orgPwd) {
   return await bcrypt.compare(inputPwd,orgPwd);
}


const User = mongoose.model("Users",userSchema)

module.exports = User;