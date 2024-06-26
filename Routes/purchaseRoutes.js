const express = require("express");
const purchaseControllers = require("../Controllers/purchaseControllers")
const authControllers = require("../Controllers/authControllers")


const router = express.Router();

router.post("/checkout/:productId",authControllers.protect,purchaseControllers.preventOwnPurchase,purchaseControllers.getCheckoutSession)
router.get("/", authControllers.protect,authControllers.restrictTo("admin", "seller"),purchaseControllers.getAllPurchases)

module.exports = router
