const express = require("express");
const reviewControllers = require("../Controllers/reviewControllers")
const authControllers = require("../Controllers/authControllers")



const router = express.Router({mergeParams:true});

console.log("001")

router.route("/")
      .get(reviewControllers.getAllReviews)
      .post(authControllers.protect,authControllers.restrictTo("user","seller"),reviewControllers.createReview)

console.log("end")

router.route("/:reviewId")
      .patch(authControllers.protect,reviewControllers.checkReviewer,reviewControllers.updateReview)
      .delete(authControllers.protect,reviewControllers.checkReviewer,reviewControllers.deleteReview)

module.exports = router
