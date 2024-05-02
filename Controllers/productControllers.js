const catchAsync = require("../Utilities/catchAsync");
const Product = require("../Models/productModal");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");
const multer = require("multer");
const sharp = require("sharp");
const storage = require("../firebase")
const { ref, uploadBytes , listAll, list, getDownloadURL} = require("firebase/storage")


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
   

   console.log(req,"1")

   // coverImage
   req.body.coverImage = `product-${req.params.id}-${Date.now()}-cover.jpeg`
   await sharp(req.files.coverImage[0].buffer).resize(2000,1500)
                               .toFormat("jpeg")
                               .jpeg({quality:90})

   

   //upload to firebase 
   const imageRef = ref(storage,`images/products/${req.body.coverImage}`)
   await uploadBytes(imageRef,req.files.coverImage[0].buffer)

   //get all product image urls from firebase
   const listProductImagesRef = ref(storage,`images/products/`)
   const storageResponse = await list(listProductImagesRef)
   const imagesUrl = await Promise.all(storageResponse.items.map(async (item)=> {
      return await getDownloadURL(item)
   }))

   //find current cover image and save image url to database
   const coverImage = imagesUrl.find((el,i)=> el.includes(req.body.coverImage))
   req.body.coverImage = coverImage
 

   console.log(coverImage,"2")
   
   //Images
   req.body.images = [];
   await Promise.all(req.files.images.map(async (file,i)=> {
      const filename =  `product-${req.params.id}-${Date.now()}-${i+1}.jpg`
      await sharp(file.buffer).resize(2000,1500)
                               .toFormat("jpeg")
                               .jpeg({quality:90})

      //upload to firebase 
      const imageRef = ref(storage,`images/products/${filename}`)
      await uploadBytes(imageRef,file.buffer)

      //get all product image urls from firebase
      const listProductImagesRef = ref(storage,`images/products/`)
      const storageResponse = await list(listProductImagesRef)
      const imagesUrl = await Promise.all(storageResponse.items.map(async (item)=> {
         return await getDownloadURL(item)
      }))

      //find current cover image and save image url to database
      const productImage = imagesUrl.find((el,i)=> el.includes(filename))
      req.body.images.push(productImage)
 
   }))

   console.log(req.body.images,"3")
   


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
   }).populate({
      path:"sold",
      select:"id"
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

   if(!product.seller._id.equals(req.user._id)) throw next(new MyError("You are not authorized to do this action",401))

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
