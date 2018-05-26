var express = require ("express");
var passport = require ("passport");
var router = express.Router ({mergeParams: true});

var User = require ("../models/user");
var Context = require ("../models/context");
var Project = require ("../models/project");

router.get ("/login", function (req, res) {
	res.render ("user-login");
});

router.post ("/login", passport.authenticate ("local", 
	{
	successRedirect: config.suburl + "/tasks",
	failureRedirect: config.suburl + "/user/login"
	}), 
	function (req, res) {}
);

router.get ("/logout", function (req, res) {
	req.logout ();

	res.redirect (config.suburl + "/login");
});

router.get ("/register", function (req, res) {
	res.render ("user-register");
});

router.post ("/register", function (req, res) {
	User.register (new User ({username: req.body.username}), req.body.password, function (err, user) {
		if (err) {
			console.log (err);
			return res.render ("user-register");
		} else {
			passport.authenticate ("local")(req, res, function () {
				var newProject = {
					name: "None",
					description: "Default project",
					status: "Not Complete",
					user: req.user._id
				};

				Project.create (newProject, function (err, createdProject) {
					if (err) {
						res.render ("whoops", {error: err});
					} else {
						var newContext = {
							name: "Inbox",
							description: "Default bucket for tasks",
							user: req.user._id
						};

						Context.create (newContext, function (err, createdContext) {
							if (err) {
								res.redirect ("whoops", {error: err});
							} else {
								User.findByIdAndUpdate (user._id, {defaultProject: createdProject._id, defaultContext: createdContext._id}, function (err, updatedUser) {
									if (err) {
										redirectes.redirect ("whoops", {error: err});
									} else {
										res.redirect (config.suburl + "/tasks");
									}
								});
							}
						});
					}
				});
			});
		}
	});
});


module.exports = router;