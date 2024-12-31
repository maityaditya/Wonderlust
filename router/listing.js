const express=require("express");
const router=express.Router();

const Listing=require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single(`listing[image]`),validateListing,wrapAsync(listingController.addNewListing))
    // .post(upload.single(`listing[image]`),(req,res)=>{
    //     res.send(req.file)
    // })


router.get("/new",isLoggedIn,wrapAsync(listingController.createNewListing))

router.get("/search",wrapAsync(listingController.searchListing));

router
    .route("/:id")
    .get(wrapAsync(listingController.showIndividualListing))
    .put(isLoggedIn,isOwner,upload.single(`listing[image]`),validateListing,wrapAsync(listingController.addEditListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing))

module.exports=router;