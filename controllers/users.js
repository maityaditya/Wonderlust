const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("authentication/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({email:email,username:username});
        let registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","User registered successfully and logged in");
            res.redirect("/listing");
        })
        
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("authentication/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","User logined successfully");
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You logged out successfully");
        res.redirect("/listing");
       
    })
}