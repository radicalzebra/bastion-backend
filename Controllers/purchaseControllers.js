const catchAsync = require("../Utilities/catchAsync");
const ApiFeatures = require("../Utilities/ApiFeatures");
const Purchase = require("../Models/purchaseModal");
const Product = require("../Models/productModal");
const MyError = require("../Utilities/MyError");
const stripe = require("stripe")


exports.getCheckoutSession = catchAsync(async (req,res,next) => {


   //get currently purchased product
   const  product = await Product.findById(req.params.productId)


   console.log(product.coverImage,"lll")
   //2) Create checkout session
    const stripee = stripe(process.env.STRIPE_SECRET_KEY)
    const session = await stripee.checkout.sessions.create({

        payment_method_types : ["card"],
        success_url:`https://bastion-dev.netlify.app/`,
        cancel_url:`https://bastion-dev.netlify.app/`,
        customer_email: req.user.email,
        client_reference_id: req.params.ProductId,
        mode:"payment",
        line_items: [
            {
              quantity: 1,
              price_data: {
                currency: 'usd',
                unit_amount: product.price * 100,
                product_data: {
                  name: product.name,
                  description: product.description,
                  images: [product.coverImage],
                },
              },
            },
          ],
    }); 


    //create purchase 
     const purchase = await Purchase.create({
         product:product._id,
         user:req.user._id,
         price:product.price
      });


   //create session as response
   res.status(200).json({
      status:"success",
      session
   })
})


exports.getAllPurchases = catchAsync(async (req,res,next)=>{


   const features = new ApiFeatures(Purchase.find(),req.query).filter().sort().limitFields()
   const purchases = await features.query

   res.status(200).json({
      status:"success",
      data:{
         purchases
      }
   })
})


exports.preventOwnPurchase = catchAsync(async (req,res,next)=>{

   if(!req.params.productId) throw next(new MyError("Wrong route to perform this action", 500))

   const product = await Product.findById(req.params.productId).populate({
      path:"seller",
      select:"id"
   });

   if(product.seller._id.equals(req.user._id)) throw next(new MyError("You cannot purchase your own product", 400));

   next();

});




// exports.createBookingCheckout = catchAsync(async (req,res,next)=>{
  
  
//   res.redirect(req.originalUrl.split("?")[0]); //new function of response watch video on this to understand what is happening in this function 
// });
