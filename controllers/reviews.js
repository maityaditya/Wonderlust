const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

module.exports.addNewReview=async(req,res,next)=>{
    let {id}=req.params;
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    let requiredListing=await Listing.findById(id);
    requiredListing.reviews.push(newReview);
    await newReview.save();
    await requiredListing.save();
    req.flash("success","New review created successfully");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyReview=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listing/${id}`);
}