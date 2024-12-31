const Listing=require("../models/listing");
const maptoken=process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: maptoken });


module.exports.index=async(req,res,next)=>{
    let allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
};

module.exports.createNewListing=(req,res,next)=>{
    res.render("listings/new.ejs");
};

module.exports.showIndividualListing=async(req,res,next)=>{
    let {id}=req.params;
    let individualList=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!individualList){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs",{individualList});
}

module.exports.addNewListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    

    let newListing=new Listing(req.body.listing);
    newListing.owner=req.user._id;
    let url=req.file.path;
    let filename=req.file.filename;
    newListing.image={url,filename};
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save()
    req.flash("success","New listing created successfully");
    res.redirect("/listing");
}

module.exports.editListing=async(req,res,next)=>{
    let {id}=req.params;
    let individualList=await Listing.findById(id);
    if(!individualList){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listing");
    }
    originalImageLink=individualList.image.url;
    originalImageLink=originalImageLink.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs",{individualList,originalImageLink});
}

module.exports.addEditListing=async(req,res,next)=>{
    let {id}=req.params;
    let newData=await Listing.findByIdAndUpdate(id,req.body.listing,{new:true,runValidators:true})
    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        newData.image={url,filename}
    }
    let response=await geocodingClient.forwardGeocode({
        query: newData.location,
        limit: 1
      })
        .send()
    if(!(newData.geometry) || newData.geometry.coordinates!==response.body.features[0].geometry.coordinates){
        newData.geometry=response.body.features[0].geometry;
    }

    await newData.save()
    
    req.flash("success","Listing updated successfully");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing=async(req,res,next)=>{
    let {id}=req.params;
    let delListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listing");
}

module.exports.searchListing=async(req,res)=>{
    let {q}=req.query;
    let allListings=await Listing.find({country:q});
    if(allListings.length>0){
        res.render("listings/index.ejs",{allListings});
    }else{
        req.flash("error","Listing you searched doesn't exists(Search based on country)");
        res.redirect("/listing");
    }
    
}