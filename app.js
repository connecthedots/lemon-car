var express = require("express"),
    app = express(),
    ejs = require("ejs"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	flash = require("connect-flash"),
	session = require("express-session"),
	MongoStore = require("connect-mongo")(session);

//Import models
const Cars = require("./models/car"),
    Users = require("./models/user"),
    seed = require("./seed")

//Express Setup
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(session({secret: "this is the secret key it goes meow",
				resave: false,
				saveUninitialized: false,
				store: new MongoStore({mongooseConnection: mongoose.connection}), 
				cookie: {maxAge: 60 * 60 *1000} //How long the session lasts on cookie (in ms)
			})
);

app.use(flash()); //must go after session is initialized

//Passport auth
const User = require("./models/user");	
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//tells passport which field to use for serializing user in session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Database setup
mongoose.connect("mongodb://localhost/lemon");

seed();


//Passing local variables to view templates
app.use(function(req,res,next){
	//To pass in connect-flash messages
	res.locals.errors = req.flash("error");
	//To check user object 
	res.locals.user = req.user;
	res.locals.session = req.session;
	next();
})

//=================ROUTES==========================

app.get("/", function(req,res){
    res.redirect("/lemon");
});

app.get("/lemon", function(req,res){
    Cars.find({},function(err, returnedPosts){
        if (err){
            console.log(err)
            res.redirect("/");
        } else {
            res.render("index", {posts: returnedPosts}); 
        }
    });
});

app.get("/viewdetail", function(req,res){
    if (req.query.lemonId){
        let id = req.query.lemonId.trim();
        //Return view with selected car
        Cars.findById(id, function(err, foundCar){
            if (err || foundCar == null){
                console.log("There was an error")
                res.redirect("/")
            } else {
                res.render("view", {lemon: foundCar});
            }
        });
    } else {
        res.redirect("/");
    }
});

//Send to the registration form
app.get("/register/:id", function(req,res){
    console.log(req.params)
    res.send("This is the registration page for car with id: " + req.params.id)
});

//Add a new car to the list
app.get("/lemon/new", function(req,res){
    res.render("cars/new")
});

app.post("lemon/new", function(req,res){
    let lemon = req.body.lemon;
    Cars.create(lemon, function(err, createdLemon){
        if(err){
            console.log(err.message);
        } else {
            res.redirect("user/dashboard")
        }
    })
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

app.get("/login", function(req,res){
    res.render("user/login");
})

app.post("/login", passport.authenticate("local", {
	failureRedirect: "login",
	failureFlash: true
}), function(req, res){
	res.redirect("/user/profile")
});

app.get("/user/profile", function(req,res){
    res.render("user/dashboard");
});

//CATCH-ALL
app.get("*", function(req,res){
  res.send("The page doesn't exist!");  
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Lemon-App is running");
})