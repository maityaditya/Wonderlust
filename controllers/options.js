const Listing=require("../models/listing.js");

module.exports.trending=async(req,res)=>{
    let allListings=await Listing.find({category:"trending"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.rooms=async(req,res)=>{
    let allListings=await Listing.find({category:"rooms"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.cities=async(req,res)=>{
    let allListings=await Listing.find({category:"cities"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.mountains=async(req,res)=>{
    let allListings=await Listing.find({category:"mountain"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.castles=async(req,res)=>{
    let allListings=await Listing.find({category:"castles"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.pools=async(req,res)=>{
    let allListings=await Listing.find({category:"pools"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.camping=async(req,res)=>{
    let allListings=await Listing.find({category:"camping"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.farms=async(req,res)=>{
    let allListings=await Listing.find({category:"farms"});
    res.render("listings/index.ejs",{allListings});
}

module.exports.arctic=async(req,res)=>{
    let allListings=await Listing.find({category:"arctic"});
    res.render("listings/index.ejs",{allListings});
}