const catchAsync = require("../Utilities/catchAsync")
const Product = require("../Models/productModal");


//GET
exports.getAllProducts = catchAsync(async (req,res) => {

   const products = await Product.find();

   res.status(200).json({
      status:"success",
      data:{
         products
      }
   })
});


exports.getProduct = catchAsync(async (req,res) => {

   const product = await Product.findById(req.params.id);

   res.status(200).json({
      status:"success",
      data:{
         product
      }
   })
});



//POST
exports.createProduct = catchAsync(async (req,res) => {

   const product = await Product.create(req.body)

   res.status(201).json({
      status:"success",
      data: {
         product
      }
   })
});



//PATCH
exports.updateProduct = catchAsync(async (req,res) => {

   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new:true,
      runValidators:true
   });

   res.status(200).json({
      status:"success",
      data:{
         product
      }
   })
});




//DELETE
exports.deleteProduct = catchAsync(async (req,res) => {

    await Product.findByIdAndDelete(req.params.id);

   res.status(204).json({
      status:"success",
      data:null
   })
});
