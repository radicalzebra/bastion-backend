const express = require("express");
const productControllers = require("../Controllers/productControllers")


const router = express.Router();


router.route("/")
      .get(productControllers.getAllProducts)
      .post(productControllers.createProduct)


router.route("/:id")
      .get(productControllers.getProduct)
      .patch(productControllers.updateProduct)
      .delete(productControllers.deleteProduct)


module.exports = router