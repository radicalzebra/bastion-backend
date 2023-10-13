const express = require("express");
const authController = require("../Controllers/authControllers");
const userControllers = require("../Controllers/userControllers");


const router = express.Router();


router.post("/signup",authController.signUp);
router.post("/login",authController.login);




router.route("/").get(userControllers.getAllUsers)
router.route("/:id").get(userControllers.getUser)


module.exports = router