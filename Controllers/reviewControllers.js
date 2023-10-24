const Review = require("../Models/reviewModal");
const catchAsync = require("../Utilities/catchAsync");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");


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


   const check = await Review.find({product: req.params.productId});
   if(!req.user._id.equals(check[0].user._id)) throw next(new MyError("You are not authorized to do this action", 401)); //equals() becaiuse we are comparing object references

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
