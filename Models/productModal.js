const mongoose = require("mongoose");
const validator = require("validator");
const User = require("./userModal")

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required : [true, "Please provide a name for the product"],
      unique: true,
      trim:true,
      maxLength : [20,"A product name must not exceed 40 characters"],
      minLength : [7,"A product name must have more than 10 characters"],
      // validate: [validator.isAlpha, "Product name must only contain alphanumeric characters"] //checks if name is alphanumeric only or not
   },

   consumer : {
      type: String,
      required : [true, "Please provide the type of consumer for the product"],
      enum : ["men", "women" , "kids"]
   },

   rating: {
      type: Number,
      default: 0,
      min: [0,"A product must have minimum rating of 0"],
      max: [5,"A product must have maximum rating of 5"],
      set: val => Math.round(val*10)/10 
   },

   ratingQuantity : {
      type:Number,
      default:0
   },

   price: {
      type: Number,
      required : [true, "Please provide a price for the product"],
   },

   discountPercent: {
      type:Number,
      validate : {
         validator: function(val) {
            return val <=50
         },

         message:"Discount percentage {{VALUE}} should be less or equal to 50"
      }
   },

   season: {
      type:String,
      required:[true,"Please provide a suitable season for the product"],
      enum:{
         values:["rainy","winter","summer","all"],
         message:"Season must be rainy, winter , summer or all"
      }
   },

   description: {
      type: String,
      required:[true,"Please provide a description for the product"],
      trim:true,
      maxLength : [500,"Product description must not exceed 500 characters"],
      minLength : [40,"Product description  must exceed 40 characters"],
   },

   sizes : {
      type: [Number],
      required:[true,"Please provide sizes for the product"]
   },

   productType: {
      type: String,
      required: [true, "Please provide a type for the product"],
      enum:{
         values: ["sneakers","casuals","sportshoes","flipflops","others"],
         message: "Product must be sneakers, casuals, sportshoes, flipflops or others"
      }
   },

   brand: {
      type: String,
      required: [true, "Please provide a brand for the product"],
      enum:{
         values:["nike","adidas","puma","reebok","fila","others"],
         message: "Brand must be nike, adidas, puma, reebok, fila or others"
      }
   },


   releaseDate: {
      type:Date,
      default: Date.now()
   },

   sold : {
      type:Number,
      default: 0
   },

   inStock: {
      type: Boolean,
      default: true
   },

   images:{
      type:[String],
      // required:[true,"Please provide images for the product"]
   },

   coverImage:{
      type:String,
      // required:[true,"Please provide a cover image for the product"]
   },

   seller: {
      type:mongoose.Schema.ObjectId,
      ref:"Users"
   }

},{
   toJSON:{virtuals:true},
   toObject:{virtuals:true}
});


//indexing
productSchema.index({price: 1,rating:-1})

//virtual populate
productSchema.virtual("reviews",{
   ref:"Reviews",
   foreignField: "product",
   localField: "_id"
})


productSchema.pre(/^find/, function(next) {
   this.populate({
      path:"seller",
      select:"username email phone photo sellerRating"
   })

   next()
})



productSchema.statics.calcSellerRating = async function(sellerId){


   const stats = await this.aggregate([
      {
         $match:{seller:sellerId}
      },

      {
         $group:{
            _id:"$seller",
            num:{$sum:1},
            avgRating:{$avg:"$rating"}
         }
      }
   ]);


   // console.log(stats)

   await User.findByIdAndUpdate(sellerId,{
      sellerRating:stats[0].avgRating
   });
   
};



productSchema.post("findOneAndUpdate", function(docs,next){

   // console.log(docs.seller,"lll")

   docs.constructor.calcSellerRating(docs.seller._id);

   next();
});



productSchema.post("findOneAndDelete", function(docs,next){
 
   docs.constructor.calcSellerRating(docs.seller._id);

   next();
});




const Product = mongoose.model("Products", productSchema);

module.exports = Product;