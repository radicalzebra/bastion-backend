const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required : [true, "Please provide a name for the product"],
      unique: true,
      trim:true
   },

   consumer : {
      type: String,
      required : [true, "Please provide the type of consumer for the product"],
      enum : ["men", "women" , "kids"]
   },

   rating: {
      type: Number,
      default: 0
   },

   price: {
      type: Number,
      required : [true, "Please provide a price for the product"],
   },

   season: {
      type:String,
      required:[true,"Please provide a suitable season for the product"],
      enum:["rainy","winter","summer","all"]
   },

   description: {
      type: String,
      required:[true,"Please provide a description for the product"],
   },

   sizes : {
      type: [Number],
      required:[true,"Please provide sizes for the product"]
   },

   productType: {
      type: String,
      required: [true, "Please provide a type for the product"],
      enum:["sneakers","casuals","sportshoes","flipflops","others"]
   },

   brand: {
      type: String,
      required: [true, "Please provide a brand for the product"],
      enum:["nike","adidas","puma","reebok","fila","others"]
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

   // images:{
   //    type:[String],
   //    required:[true,"Please provide images for the product"]
   // },

   // coverImage:{
   //    type:String,
   //    required:[true,"Please provide a cover image for the product"]
   // }

   // cart
   //reviews

});


const Product = mongoose.model("Products", productSchema);

module.exports = Product;