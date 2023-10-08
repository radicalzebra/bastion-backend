const express = require("express");
const morgan = require("morgan");
const globalErrorhandler = require("./Utilities/globalErrorHandler");
const MyError = require("./Utilities/MyError");
const productRouter = require("./Routes/productRoutes");
const userRouter = require("./Routes/userRoutes");
const reviewRouter = require("./Routes/reviewRoutes");


const app = express();


//Middlewares
if(process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}
app.use(express.json());


//Routes
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/reviews", reviewRouter);


app.all("*", (req,res,next)=> {
   next(new MyError(`Can't find ${req.originalUrl} on this server`,404))
})


app.use(globalErrorhandler)

module.exports = app;