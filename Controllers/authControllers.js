const User = require("../Models/userModal");
const catchAsync = require("../Utilities/catchAsync");
const MyError = require("../Utilities/MyError");
const jwt = require("jsonwebtoken")
const {promisify} = require("util")



const signToken = (id) => {

  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn : process.env.JWT_EXPIRES_IN
   })

}


const createSendToken = (user,statusCode,res) => {
   const token = signToken(user._id);

   const cookeOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      secure: false,
      httpOnly: true
   }

   if(process.env.NODE_ENV === "production") cookeOptions.secure = false

   res.cookie("jwt",token,);


   user.password = undefined,

   res.status(statusCode).json({
      status:"success",
      token,
      data:{
         user
      }
   })
}


exports.signUp = catchAsync(async (req,res,next) => {

   if(req.body.role === "admin") return next(new MyError("You are not authorized to be an admin",401))

   const user = await User.create(req.body);

   createSendToken(user,201,res)
});


exports.login = catchAsync(async (req,res,next) => {

   const {email,password} = req.body;

   //check if email and password exist
   if(!email || !password) return  next(new MyError("Please provide email & password", 400))

   //check if user exist and password is correct
   const user = await User.findOne({email}).select("+password");

   if(!user || !await user.correctPassword(password,user.password)) return next(new MyError("Incorrect email or password", 401))


   //if everything okay, send token to client
   createSendToken(user,200,res)

});


exports.protect = catchAsync(async (req,res,next) => {

   //Getting token and heck if it's there
   let token;
   if(req.cookies.jwt) {
      token = req.cookies.jwt
   };

   if(!token) next(new MyError("Please login to get access!",401));


   //Verify token
   const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET)


   //check if user still exists
   const user = await User.findById(decoded.id);

   if(!user) next(new MyError("The user belonging to the token does not exist!",401))


   //check if user changed password after the token was issued
   if(user.changedPasswordAfter(decoded.iat)) return next(new MyError("User recently changed password, please login again!",401));


   //grant access to protected route
   req.user = user;
   next();
});



exports.restrictTo = (...roles) => {
   
  return (req,res,next) => {
      if(!roles.includes(req.user.role)) next(new MyError("You do not have the right to access this resource",401))
      next()
  }
   
}