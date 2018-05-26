var express = require ("express");
var bodyParser = require ("body-parser");
var mongoose = require ("mongoose");
var methodOverride = require ("method-override");
var passport = require ("passport");
var localStrategy = require	("passport-local");
var passportLocalMongoose = require ("passport-local-mongoose");


global.config = {
	suburl : ""
} 


/***********************************
Configure Express
***********************************/
var app = express ();
app.use (bodyParser.urlencoded ({extended: true}));
app.use (express.static ("/assets"));
app.set('views', __dirname + "/views");
app.set ("view engine", "ejs");
app.use (methodOverride ("_method"));
app.use (require ("express-session") ({
	secret: "A urna parturient in parturient egestas nisi commodo blandit vitae ante hac tincidunt convallis parturient diam ad parturient malesuada quis vel felis lacus a fames et mus potenti.",
	resave: false,
	saveUninitialized: false
}));
app.use (passport.initialize ());
app.use (passport.session ());


/***********************************
Mongoose/MongoDB setup
***********************************/
mongoose.connect ("mongodb://localhost/ontask");

var Task = require ("./models/task");
var Context = require ("./models/context");
var Project = require ("./models/project");
var User = require ("./models/user");


/***********************************
Get Passport going
***********************************/
passport.serializeUser (User.serializeUser ());
passport.deserializeUser (User.deserializeUser ());
passport.use (new localStrategy (User.authenticate ()));
app.use (function (req, res, next) {
	res.locals.currentUser = req.user;
	next ();
});


/***********************************
Bring in the routes
***********************************/
app.get (config.suburl + "/", function (req, res) {
	res.redirect (config.suburl + "/tasks");
});

var routesTask = require ("./routes/task");
app.use (config.suburl + "/tasks", routesTask);

var routesContext = require ("./routes/context");
app.use (config.suburl + "/contexts", routesContext);

var routesProject = require ("./routes/project");
app.use (config.suburl + "/projects", routesProject);

var routesUser = require ("./routes/user");
app.use (config.suburl + "/user", routesUser);


/***********************************
And, finally, listen on the network
***********************************/
app.listen (3000, function () {
	console.log ("The app, 'onTask,' has started!");
});
