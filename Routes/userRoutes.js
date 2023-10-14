const express = require("express");
const authController = require("../Controllers/authControllers");
const userControllers = require("../Controllers/userControllers");


const router = express.Router();


router.post("/signup",authController.signUp);
router.post("/login",authController.login);




router.route("/").get(authController.protect,authController.restrictTo("admin"),userControllers.getAllUsers)
router.route("/:id").get(authController.protect,authController.restrictTo("admin"),userControllers.getUser)


module.exports = router