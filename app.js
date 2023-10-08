const express = require("express");
const morgan = require("morgan");
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

module.exports = app;