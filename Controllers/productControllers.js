const catchAsync = require("../Utilities/catchAsync");
const Product = require("../Models/productModal");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");


//GET
exports.getAllProducts = catchAsync(async (req,res,next) => {

   const features = new ApiFeatures(Product.find(),req.query).filter().sort().limitFields()

   const products = await features.query

   res.status(200).json({
      status:"success",
      result:products.length,
      data:{
         products
      }
   })
});


exports.getProduct = catchAsync(async (req,res,next) => {

   const product = await Product.findById(req.params.id).populate({
      path:"reviews"
   });

   if(!product) return next(new MyError("No product found with that ID",404))

   res.status(200).json({
      status:"success",
      data:{
         product
      }
   })
});



//POST
exports.createProduct = catchAsync(async (req,res,next) => {

   req.body.seller = req.user._id

   const product = await Product.create(req.body)

   res.status(201).json({
      status:"success",
      data: {
         product
      }
   })
});



//PATCH
exports.updateProduct = catchAsync(async (req,res,next) => {

   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
   });

   if(!product) return next(new MyError("No product found with that ID",404))

   res.status(200).json({
      status:"success",
      data:{
         product
      }
   })
});




//DELETE
exports.deleteProduct = catchAsync(async (req,res,next) => {

   const product = await Product.findByIdAndDelete(req.params.id);

   if(!product) return next(new MyError("No product found with that ID",404))

   res.status(204).json({
      status:"success",
      data:null
   })
});
