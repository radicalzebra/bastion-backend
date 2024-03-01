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

// const allowedOrigins = [
//   'http://localhost:5173', // Add your localhost frontend
//   'https://bastion-dev.netlify.app',    // Add your production frontend
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Check if the origin is in the allowedOrigins array or if it is undefined (e.g., not a cross-origin request)
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }

//     // console.log(origin,"1")
//   },
//   credentials: true
// }));


app.use((req, res, next) => {
  
  // const allowedOrigins = ['http://localhost:5173', 'https://bastion-dev.netlify.app'];
  // const origin = req.headers.origin;
  

  // if (allowedOrigins.includes(origin)) {
  //   res.header('Access-Control-Allow-Origin', origin);
  // }
  
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//Middlewares
if(process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
  
}

app.use(express.static(path.join(__dirname,"Public"))); 

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
