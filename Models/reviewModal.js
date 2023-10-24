const mongoose = require("mongoose")


const reviewSchema = new mongoose.Schema({

   review:{
      type:String,
      required:[true,"Review cannot be empty"],
      maxLength:[900,"A review cannot have more than 900 characters"]
   },

   rating:{
      type:Number,
      min:1,
      max:5,
      required:[true,"A review must have a rating"]
   },

   createdAt:{
      type:Date,
      default:Date.now()
   },

   product:{
      type:mongoose.Schema.ObjectId,
      ref:"Products",
      required:[true,"A review must belong to a product"]
   },

   user:{
      type:mongoose.Schema.ObjectId,
      ref:"Users",
      required:[true,"A review must belong to a user"]
   }

})


reviewSchema.pre(/^find/, function(next) {
   // this.populate({
   //    path:"product",
   //    select:"-__v name rating price season brand"
   // })
   this.populate({
      path:"user",
      select:"username email photo"
   })

   next()
})



const Review = mongoose.model("Reviews", reviewSchema)


module.exports = Review