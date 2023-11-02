const MyError = require("../Utilities/MyError");

function handleCastErrorDB(err) {
   const message = `Invalid ${err.path} : ${err.value}.`

   return new MyError(message,400)
}



function handleDuplicateFieldsDB(err) {
   const message = `Dublicate field value : ${err.keyValue.name}, please use another value!`

   return new MyError(message,400)
}

function handleValidationErrorDB(err) {
   const message = Object.values(err.errors).map(el => el.message).join(" & ")

   console.log(Object.values(err.errors))

   return new MyError(message,400)
}


function handleJWTError() {
   return new MyError("Invalid token, Please login again!", 401)
}

function handleJWTExpiredError() {
   return new MyError("Your token has expired, Please login again!", 401)
}



const sendErrorDev = (err,res) => {
  
      res.status(err.statusCode).json({
         status : err.status,
         message:err.message,
         stack: err.stack,
         error: err
      });
   
}


const sendErrorProd = (err,res) => {
   if(err.isOperational) {
      
      res.status(err.statusCode).json({
         status : err.status,
         message: err.message
      });
   } else {
      console.log("Error 🔥", err)
      
      res.status(500).json({
         status:"error",
         message: "Something went wrong"
      })
   }
}






const globalErrorHandler = (err,req,res,next) => {
   err.statusCode = err.statusCode || 500
   err.status = err.status || "error"

   if(process.env.NODE_ENV === "production") {
     sendErrorDev(err,res)
   } else if(process.env.NODE_ENV === "development") {
      let error = {...err};

      if(err.name === "CastError") error = handleCastErrorDB(error)
      if(err.code === 11000) error = handleDuplicateFieldsDB(error)
      if(err.name === "ValidationError") error = handleValidationErrorDB(error)
      if(err.name === "JsonWebTokenError") error = handleJWTError()
      if(err.name === "TokenExpiredError") error = handleJWTExpiredError()


      sendErrorProd(error,res)
   }
}

module.exports = globalErrorHandler;
