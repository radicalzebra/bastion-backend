const express = require("express");
const productControllers = require("../Controllers/productControllers")
const authControllers = require("../Controllers/authControllers")
const reviewRouter = require("../Routes/reviewRoutes")


const router = express.Router();


router.route("/")
.get(productControllers.getAllProducts)
.post(authControllers.protect,authControllers.restrictTo("seller"),productControllers.createProduct)

router.route("/:id")
.get(productControllers.getProduct)
.patch(authControllers.protect,authControllers.restrictTo("seller"),productControllers.check,productControllers.uploadProductImages,productControllers.resizeProductImages,productControllers.updateProduct)
.delete(authControllers.protect,productControllers.check,productControllers.deleteProduct)

router.use("/:productId/reviews", reviewRouter)


module.exports = router
