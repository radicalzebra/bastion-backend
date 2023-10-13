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

   if(!user) return next(new MyError("No product found with that ID",404))

   res.status(200).json({
      status:"success",
      data:{
         user
      }
   })
});
