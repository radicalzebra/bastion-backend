const express = require("express");
const morgan = require("morgan");
const globalErrorhandler = require("./Utilities/globalErrorHandler");
const MyError = require("./Utilities/MyError");
const productRouter = require("./Routes/productRoutes");
const userRouter = require("./Routes/userRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const cookieParser = require(`cookie-parser`);
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");


const app = express();


//Middlewares
if(process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());


//Routes
app.use("/bastion/api/users", userRouter);
app.use("/bastion/api/products", productRouter);
app.use("/bastion/api/reviews", reviewRouter);


app.all("*", (req,res,next)=> {
   next(new MyError(`Can't find ${req.originalUrl} on this server`,404))
})


app.use(globalErrorhandler)

module.exports = app;