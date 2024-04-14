const mongoose = require("mongoose")

const purchaseSchema = new mongoose.Schema({

   product:{
      type:mongoose.Schema.ObjectId,
      ref:"Products",
      required:[true,"A purchase must belong to a product"]
   },
   
   user:{
      type:mongoose.Schema.ObjectId,
      ref:"Users",
      required:[true,"A purchase must belong to a user"]
   },

   
   price:{
      type:Number,
      required:[true,"A purchase must have a price"]
   },

   size:{
      type:Number,
      required:[true,"A purchase must have a size"]
   },
   
   createdAt:{
      type:Date,
      default:Date.now()
   }
})


purchaseSchema.pre("find", function(next) {
   this.populate({
      path:"user",
      select:"username email"
   }).populate({
      path:"product",
      select:"name consumer"
   })

   next()
})

const Purchase = mongoose.model("Purchases",purchaseSchema)

module.exports = Purchase
