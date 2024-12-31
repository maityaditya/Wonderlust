const express=require("express");
const router=express.Router();

const Listing=require("../models/listing.js");
const allOptions=require("../controllers/options.js");
const wrapAsync=require("../utils/wrapAsync.js");

router.get("/trending",wrapAsync(allOptions.trending))

router.get("/rooms",wrapAsync(allOptions.rooms))

router.get("/cities",wrapAsync(allOptions.cities))

router.get("/mountains",wrapAsync(allOptions.mountains))

router.get("/castles",wrapAsync(allOptions.castles))

router.get("/pools",wrapAsync(allOptions.pools))

router.get("/camping",wrapAsync(allOptions.camping))

router.get("/farms",wrapAsync(allOptions.farms))

router.get("/arctic",wrapAsync(allOptions.arctic))

module.exports=router;