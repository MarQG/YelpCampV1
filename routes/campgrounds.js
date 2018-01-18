var express         = require("express");
var router          = express.Router();
var Campground      = require("../models/campgrounds");
var middleware      = require("../middleware");

//INDEX - Show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

//CREATE - Add a new campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to camgrounds array
    
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author};
    //Create a new campground and save to the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});


//NEW - Show form to add a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

//SHOW - /campground/:id  Shows info about one campground
router.get("/:id", function(req, res){
    //Find campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           //render show template with that campground
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
    
    
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
           
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", function(req, res){
    // find and update correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    // redirect to show page
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;