const express=require("express");
const router=express.Router({mergeParams:true});

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {validateReview}=require("../middleware.js")
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.addNewReview))
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))


module.exports=router;