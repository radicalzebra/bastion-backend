const User = require("../Models/userModal");
const catchAsync = require("../Utilities/catchAsync");
const ApiFeatures = require("../Utilities/ApiFeatures");
const MyError = require("../Utilities/MyError");


//GET
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



exports.updateMe = catchAsync(async (req,res,next)=>{

  //1:Create error if user posts password
  if(req.body.password || req.body.passwordConfirm) throw next(new MyError("This route is not defined for password updates, please use /update-password route", 400));
  if(req.body.role) throw next(new MyError("You cannot update your role", 400));

  //2:update user document & filter unwanted fields
  const user = await User.findByIdAndUpdate(req.user._id, req.body ,{
    runValidators:true,
    new:true
  });



  res.status(200).json({
    status:"succcess",
    data:{
      user
    }
  });
});


exports.deleteMe = catchAsync(async (req,res,next)=>{

  await User.findByIdAndUpdate(req.user._id,{active:false});

  res.status(204).json({   //204 means deleted
     status:"success",
     data:null
  });
});
