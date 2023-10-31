const express = require("express");
const purchaseControllers = require("../Controllers/purchaseControllers")
const authControllers = require("../Controllers/authControllers")


const router = express.Router();

router.get("/checkout/:productId",authControllers.protect,purchaseControllers.preventOwnPurchase,purchaseControllers.getCheckoutSession)
router.get("/", authControllers.protect,authControllers.restrictTo("admin"),purchaseControllers.getAllPurchases)

module.exports = router