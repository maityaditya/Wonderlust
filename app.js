if(process.env.NODE_ENV !="production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const User=require("./models/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");

const atlasdbUrl=process.env.ATLASDB_URL;

const store=MongoStore.create({
    mongoUrl:atlasdbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

let sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()*7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

const listing=require("./router/listing.js");
const review=require("./router/review.js");
const user=require("./router/user.js");
const option=require("./router/option.js");

main().then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log("some error occured in database");
})
async function main() {
    await mongoose.connect(atlasdbUrl);
}

app.listen(port,()=>{
    console.log(`Listening to port ${port}`);
})

// app.get("/",(req,res)=>{
//     res.send("I am in root")
// })

app.use("/listing",listing);
app.use("/listing/:id/reviews",review);
app.use("/",user);
app.use("/",option);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

app.use((err,req,res,next)=>{
    let{status=500,message="Some error occured"}=err;
    res.status(status).render("error.ejs",{message});
})