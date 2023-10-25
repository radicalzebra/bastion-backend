const Review = require("../Models/reviewModal");
const catchAsync = require("../Utilities/catchAsync");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");
const Product = require("../Models/productModal"); 


//GET
exports.getAllReviews = catchAsync(async (req,res,next) => {

   let filter = {}
   if(req.params.productId) filter = {product : req.params.productId.trim()}

   const reviews = await Review.find(filter)

   res.status(200).json({
      status:"success",
      result:reviews.length,
      data:{
         reviews
      }
   })
});




//POST
exports.createReview = catchAsync(async (req,res,next) => {

   const product = await Product.findById(req.params.productId)

   if(product.seller._id.equals(req.user._id)) throw next(new MyError("You cannot review your own product",400))

   console.log()

   req.body.user = req.user._id
   req.body.product = req.params.productId

   const review = await Review.create(req.body)

   res.status(201).json({
      status:"success",
      data: {
        review
      }
   })
});


//util
exports.checkReviewer = catchAsync(async(req,res,next)=>{


   const check = await Review.find({product: req.params.productId , user:req.user._id, _id:req.params.reviewId});
    if(!check) throw next(new MyError("You are not authorized to do this action", 401)); 
   
   // if(!req.user._id.equals(check[check.length-1].user._id)) throw next(new MyError("You are not authorized to do this action", 401)); //equals() becaiuse we are comparing object references


   next();
});



//PATCH
exports.updateReview = catchAsync(async (req,res,next) => {

   const review = await Review.findByIdAndUpdate(req.params.reviewId, req.body, {
      new:true,
      runValidators:true
   });

   if(!review) return next(new MyError("No review found with that ID",404))

   res.status(200).json({
      status:"success",
      data:{
         review
      }
   })
});




//DELETE
exports.deleteReview = catchAsync(async (req,res,next)=>{

   await Review.findByIdAndDelete(req.params.reviewId);

   res.status(204).json({
      status:"success",
   })
});
