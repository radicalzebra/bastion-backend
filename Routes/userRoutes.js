const express = require("express");
const authController = require("../Controllers/authControllers");
const userControllers = require("../Controllers/userControllers");


const router = express.Router();


router.post("/signup",authController.signUp);
router.post("/login",authController.login);


router.post("/forgot-password",authController.forgotPassword);
router.post("/reset-password/:resetToken",authController.protect,authController.resetPassword);
router.patch("/update-password", authController.protect,authController.updatePassword);
router.patch("/updateMe",authController.protect,userControllers.uploadUserPhoto,userControllers.resizeUserPhoto,userControllers.updateMe);
router.delete("/deleteMe",authController.protect,userControllers.deleteMe);
router.put("/updateCart",authController.protect,userControllers.updateCart);
router.get("/me",authController.protect,userControllers.getMe,userControllers.getUser)
// router.get("/images/:img",userControllers.getImage)




router.route("/").get(authController.protect,authController.restrictTo("admin"),userControllers.getAllUsers)
router.route("/:id").get(authController.protect,authController.restrictTo("admin"),userControllers.getUser)


module.exports = router