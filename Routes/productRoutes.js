const express = require("express");
const productControllers = require("../Controllers/productControllers")
const authControllers = require("../Controllers/authControllers")
const reviewRouter = require("../Routes/reviewRoutes")


const router = express.Router();

/** the two post and patch route handlers are commented because there was some problem with the img processing and was unable to diagnose the problem
and the image is not being sent to my firebase storage but saved as it is, same case with user image update in userRoutes , i think that the issue lies with
my host provider which sends an error without an error.stackTrace(sus) */

router.route("/")
.get(productControllers.getAllProducts)
// .post(authControllers.protect,authControllers.restrictTo("seller"),productControllers.uploadProductImages,productControllers.resizeProductImages,productControllers.createProduct)
.post(authControllers.protect,authControllers.restrictTo("seller"),productControllers.createProduct)

router.use("/:productId/reviews", reviewRouter)

router.route("/:id")
.get(productControllers.getProduct)
// .patch(authControllers.protect,authControllers.restrictTo("seller"),productControllers.uploadProductImages,productControllers.resizeProductImages,productControllers.updateProduct)
.patch(authControllers.protect,authControllers.restrictTo("seller"),productControllers.updateProduct)
.delete(authControllers.protect,productControllers.deleteProduct)



module.exports = router
