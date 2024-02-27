const User = require("../Models/userModal");
const catchAsync = require("../Utilities/catchAsync");
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


exports.resizeUserPhoto = catchAsync(async (req,res,next) => {

   if (!req.file) return next();


   req.body.photo = `user-${req.user.id}-${Date.now()}.jpeg`


   await sharp(req.file.buffer).resize(500,500)
                               .toFormat("jpeg")
                               .jpeg({quality:90})
                              //  .toFile(`Public/Images/Users/${req.file.filename}`)


   //upload to firebase                              
   const imageRef = ref(storage,`images/users/${req.body.photo}`)
   await uploadBytes(imageRef,req.file.buffer)


   //get all all users' image urls from firebase
   const listUserImagesRef = ref(storage,`images/users/`)
   const storageResponse = await list(listUserImagesRef)
   const imagesUrl = await Promise.all(storageResponse.items.map(async (item)=> {
      return await getDownloadURL(item)
   }))

   //find current user image and save image url to database
   const userImage = imagesUrl.find((el,i)=> el.includes(req.body.photo))
   req.body.photo = userImage

   


   next()

})


exports.uploadUserPhoto = upload.single("photo")


exports.getAllUsers = catchAsync(async (req,res,next) => {

   const features = new ApiFeatures(User.find(),req.query).filter().sort().limitFields()

   const users = await features.query

   res.status(200).json({
      status:"success",
      result:users.length,
      data:{
         users
      }
   })
});



exports.getUser = catchAsync(async (req,res,next) => {

   const user = await User.findById(req.params.id);

   if(!user) return next(new MyError("No user found with that ID",404))

   res.status(200).json({
      status:"success",
      data:{
         user
      }
   })
});


exports.getMe = catchAsync(async(req,res,next) => {

   req.params.id = req.user.id
   next()
})



exports.updateMe = catchAsync(async (req,res,next)=>{

  //1:Create error if user posts password
  if(req.body.password || req.body.passwordConfirm) throw next(new MyError("This route is not defined for password updates, please use /update-password route", 400));
  if(req.body.cart) throw next(new MyError("This route is not defined for cart updates, please use /updateCart route", 400));
  if(req.body.role) throw next(new MyError("You cannot update your role", 400));


  //2:update user document & filter unwanted fields
  const user = await User.findByIdAndUpdate(req.user._id, req.body ,{
    runValidators:true,
    new:true
  });



  res.status(200).json({
    status:"success",
    data:{
      user
    }
  });
});



exports.updateCart = catchAsync(async (req,res,next) => {

   const user = await User.findByIdAndUpdate(req.user._id,{cart:req.body.cart},{
    runValidators:true,
    new:true
   })

  res.status(200).json({
    status:"success",
    data:{
      user
    }
  });
})


exports.deleteMe = catchAsync(async (req,res,next)=>{

  await User.findByIdAndUpdate(req.user._id,{active:false});

  res.status(204).json({   //204 means deleted
     status:"success",
     data:null
  });
});


