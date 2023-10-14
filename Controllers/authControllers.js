const User = require("../Models/userModal");
const catchAsync = require("../Utilities/catchAsync");
const MyError = require("../Utilities/MyError");
const jwt = require("jsonwebtoken")



const signToken = (id) => {

  return jwt.sign({id},process.env.JWT_SECRET,{
            expiresIn : process.env.JWT_EXPIRES_IN
         })

}


exports.signUp = catchAsync(async (req,res,next) => {

   if(req.body.role === "admin") return next(new MyError("You are not authorized to be an admin",401))

   const user = await User.create(req.body);

   const token = signToken(user._id)

   res.status(200).json({
      status:"success",
      token,
      data:{
         user
      }
   })
});


exports.login = catchAsync(async (req,res,next) => {

   const {email,password} = req.body;

   //check if email and password exist
   if(!email || !password) return  next(new MyError("Please provide email & password", 400))

   //check if user exist and password is correct
   const user = await User.findOne({email}).select("+password");

   if(!user || !await user.correctPassword(password,user.password)) return next(new MyError("Incorrect email or password", 401))


   //if everything okay, send token to client
   const token = signToken(user._id)

   res.status(200).json({
      status:"success",
      token,
      data:{
         user
      }
   })
});


exports.protect = catchAsync(async (req,res,next) => {

   //Getting token and heck if it's there


   //Verify token


   //check if user still exists


   //check if user changed password after the token was issued
});