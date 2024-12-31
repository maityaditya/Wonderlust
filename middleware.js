const Listing = require("./models/listing");
const Review=require("./models/review.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const ExpressError=require("./utils/ExpressError.js");

module.exports.validateListing=(req,res,next)=>{
    let result=listingSchema.validate(req.body);
    if(result.error){
        next(new ExpressError(400,result.error));
    }else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let result=reviewSchema.validate(req.body);
    if(result.error){
        next(new ExpressError(400,result.error));
    }else{
        next();
    }
}

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must first logged in");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing")
        return res.redirect(`/listing/${id}`)
    }
    next()
}

module.exports.isReviewAuthor=async (req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review")
        return res.redirect(`/listing/${id}`)
    }
    next()
}