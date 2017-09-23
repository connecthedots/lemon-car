var express = require("express"),
    app = express(),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	flash = require("connect-flash")

//Import models
const Cars = require("./models/car"),
    Users = require("./models/user"),
    seed = require("./seed")

//Express Setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//Passport auth
const User = require("./models/user");	
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//tells passport which field to use for serializing user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//MONGO & MONGOOSE
mongoose.connect("mongodb://localhost/lemon");

// seed();

//=================ROUTES==========================

app.get("/", function(req,res){
    res.redirect("/search");
});

app.get("/search", function(req,res){
    Cars.find({},function(err, returnedPosts){
        if (err){
            console.log(err)
            res.redirect("/");
        } else {
            res.render("index", {posts: returnedPosts}); 
        }
    });
});

app.get("/viewcar", function(req,res){
    if (req.query.lemonId){
        let id = req.query.lemonId.trim();
        //Return view with selected car
        Cars.findById(id, function(err, foundCar){
            if (err){
                console.log(err.message)
                res.redirect("/")
            } else {
                res.render("view", {lemon: foundCar});
            }
        });
    } else {
        res.redirect("/")
    }
});

//Login Logic
app.get("/signup", function(req,res){
    res.render("user/signup")
})

app.post("/signup", function(req,res){
	//Construct user data object
	let newUser = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username
	};
	//hash password, add to User object, save in DB
	Users.register(newUser, req.body.password, function(err, createdUser){
		if (err){
            req.flash("error", err.message);
            console.log(err.message)
            return res.redirect("signup");			
		}
		//If no error, authenticate and log in the user
        passport.authenticate("local")(req,res,function(){
        	res.redirect("/user/profile")
        });
	});    
})


//CATCH-ALL
app.get("*", function(req,res){
  res.send("The page doesn't exist!");  
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Lemon-App is running");
})