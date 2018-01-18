var express         = require("express"),
    app             = express(), 
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campgrounds"),
    Comment         = require("./models/comments"),
    User            = require("./models/user"),
    seedDB          = require("./seeds");
    
//requiring routes
    
var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

console.log(process.env.DATABASEURL);

mongoose.connect(process.env.DATABASEURL);
//mongoose.connect("external DB Link");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Seed Database
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Miko is the cutest cat ever!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


// ==============
// ROUTES
// ===============

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started!");
});
