const mongoose = require("mongoose")
const Product = require("./productModal")


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
      required:[true,"A review must have a rating"],
      set: val => Math.round(val*10)/10 
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


reviewSchema.index({user: 1, product: 1}, {unique:true})


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


reviewSchema.statics.calcAvgRatings = async function(productId) {
 
   const stats = await this.aggregate([
      {
         $match : {product : productId}
      }, 

      {
         $group : {
            _id:"$product",
            numRating: {$sum : 1},
            avgRating: {$avg: "$rating"}
         }
      }
   ])

   await Product.findByIdAndUpdate(productId,{
      rating:stats[0].avgRating ,
      ratingQuantity : stats[0].numRating
   },{
      new:true,
      runValidators:true
   })
}


reviewSchema.post("save",function(doc,next){
   this.constructor.calcAvgRatings(this.product)
   next()
})

reviewSchema.post("findOneAndUpdate", function(docs,next){
   docs.constructor.calcAvgRatings(docs.product._id);
   next();
});

reviewSchema.post("findOneAndDelete", function(docs,next){
   docs.constructor.calcAvgRatings(docs.product._id);
   next();
});



const Review = mongoose.model("Reviews", reviewSchema)


module.exports = Review