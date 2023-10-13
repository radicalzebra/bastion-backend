const User = require("../Models/userModal");
const catchAsync = require("../Utilities/catchAsync");
const MyError = require("../Utilities/MyError");


exports.signUp = catchAsync(async (req,res,next) => {

   const user = await User.create(req.body);

   res.status(200).json({
      status:"success",
      data:{
         user
      }
   })
});


exports.login = catchAsync(async (req,res,next) => {

   const user = await User.create(req.body);

   res.status(200).json({
      status:"success",
      data:{
         user
      }
   })
});