const express = require("express");
const productControllers = require("../Controllers/productControllers")
const authControllers = require("../Controllers/authControllers")
const reviewRouter = require("../Routes/reviewRoutes")


const router = express.Router();


router.route("/")
.get(productControllers.getAllProducts)
.post(authControllers.protect,authControllers.restrictTo("seller"),productControllers.createProduct)


router.use("/:productId/reviews", reviewRouter)


router.route("/:id")
.get(productControllers.getProduct)
.patch(productControllers.updateProduct)
.delete(productControllers.deleteProduct)


module.exports = router