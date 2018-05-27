var express = require ("express");
var router = express.Router ({mergeParams: true});

var Context = require ("../models/context");
var Task = require ("../models/task");
var Project = require ("../models/project");
var User = require ("../models/user");


/***********************************
INDEX PROJECT Route (a.k.a list tasks)
***********************************/
router.get ("/", isLoggedIn, function (req, res) {
	Project.find ({user: req.user._id, status: "Not Complete"}, function (err, projectList) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("projects-list", {projects: projectList});
		}
	});
});


/***********************************
NEW PROJECT Route
***********************************/
router.get ("/new", isLoggedIn, function (req, res) {
	res.render ("projects-new");
});


/***********************************
CREATE PROJECT Route
***********************************/
router.post ("/", isLoggedIn, function (req, res) {
	var newProject = {
		name: req.body.project.name,
		description: req.body.project.description,
		project_num: req.body.project.projNum,
		charge_num: req.body.project.chargeNum,
		user: req.user._id,
		status: "Not Complete"
	};

	Project.create (newProject, function (err, createdProject) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/projects");
		}
	});
});


/***********************************
SHOW PROJECT Route
***********************************/
router.get ("/:id", isLoggedIn, function (req, res){
	Project.findById (req.params.id, function (err, foundProject) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			Task.find ({project: req.params.id, status: "Not Complete"}).populate ("context").exec (function (err, projectTasks) {
				if (err) {
					res.render ("whoops", {error: err});
				} else {
					res.render ("projects-show", {project: foundProject, tasks: projectTasks});
				}
			});
		}
	});
});


/***********************************
EDIT PROJECT Route
***********************************/
router.get ("/:id/edit", isLoggedIn, function (req, res) {
	Project.findById (req.params.id, function (err, foundProject) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("projects-edit", {project: foundProject});
		}
	});
});


/***********************************
UPDATE PROJECT Route
***********************************/
router.put ("/:id", isLoggedIn, function (req, res) {
	Project.findByIdAndUpdate (req.params.id, req.body.project, function (err, updatedProject) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/projects/" + req.params.id);
		}
	});
});


/***********************************
DELETE PROJECT Route
***********************************/
router.delete ("/:id", isLoggedIn, function (req, res) {
	Project.findByIdAndRemove (req.params.id, function (err) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/projects");
		}
	});
});


/***********************************
Complete PROJECT Route
***********************************/
router.get ("/:id/complete", isLoggedIn, function (req, res) {
	Project.findByIdAndUpdate (req.params.id, {status: "Complete"}, function (err, updatedTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/projects");
		}
	});
});


function isLoggedIn (req, res, next) {
	if (req.isAuthenticated ()) {
		return next ();
	} else {
		res.redirect ("/user/login");
	}
}


module.exports = router;
