const catchAsync = require("../Utilities/catchAsync");
const Product = require("../Models/productModal");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");
const multer = require("multer");
const sharp = require("sharp");


const multerStorage = multer.memoryStorage()

const multerFilter = (req,file,cb) => {

   if(file.mimetype.startsWith("image")) return  cb(null,true)
   return cb(new MyError("Not an image! Please upload only images.",400),false)
}

const upload = multer({
   storage: multerStorage,
   fileFilter:multerFilter
})


exports.uploadProductImages = upload.fields([
   {name:"coverImage", maxCount:1},
   {name:"images", maxCount:5}
])


exports.resizeProductImages = catchAsync(async (req,res,next) => {

   if (!req.files.coverImage || !req.files.images) return next();


   // coverImage
   req.body.coverImage  = `product-${req.params.id}-${Date.now()}-cover.jpeg`
   await sharp(req.files.coverImage[0].buffer).resize(2000,1500)
                               .toFormat("jpeg")
                               .jpeg({quality:90})
                               .toFile(`Public/Images/Products/${req.body.coverImage}`)

   
   //Images
   req.body.images = [];
   await Promise.all(req.files.images.map(async (file,i)=> {
      const filename =  `product-${req.params.id}-${Date.now()}-${i+1}.jpg`
      await sharp(file.buffer).resize(2000,1500)
                               .toFormat("jpeg")
                               .jpeg({quality:90})
                               .toFile(`Public/Images/Products/${filename}`)
      
      req.body.images.push(filename)
   }))


   next()


})


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



exports.check = catchAsync(async(req,res,next) => {

   const product = await Product.findById(req.params.id);

   if(!product.seller._id.equals(req.user._id)) throw next("You are not authorized to do this action",401)

   next()
})



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
