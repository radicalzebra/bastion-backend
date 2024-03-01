const express = require("express");
const morgan = require("morgan");
const path = require("path");
const globalErrorhandler = require("./Utilities/globalErrorHandler");
const MyError = require("./Utilities/MyError");
const productRouter = require("./Routes/productRoutes");
const userRouter = require("./Routes/userRoutes");
const purchaseRouter = require("./Routes/purchaseRoutes");
const cookieParser = require(`cookie-parser`);
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require('cors');


const app = express(); 


// app.use((req, res, next) => {
    
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });


//Middlewares
if(process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
  
}

app.use(express.static(path.join(__dirname,"Public"))); 
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());


//Routes
app.use("/bastion/api/users", userRouter);
app.use("/bastion/api/products", productRouter); 
app.use("/bastion/api/purchases", purchaseRouter);


app.all("*", (req,res,next)=> {
   next(new MyError(`Can't find ${req.originalUrl} on this server`,404))
})


app.use(globalErrorhandler)

module.exports = app;
