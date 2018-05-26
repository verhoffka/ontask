var express = require ("express");
var router = express.Router ({mergeParams: true});

var Task = require ("../models/task");
var Context = require ("../models/context");
var Project = require ("../models/project");
var User = require ("../models/user");


/***********************************
NEW TASK Route
***********************************/
router.get ("/new", isLoggedIn, function (req, res) {
	Context.find ({user: req.user._id}, function (err, contextList) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			Project.find ({user: req.user._id, status: "Not Complete"}, function (err, projectList) {
				if (err) {
					res.render ("whoops", {error: err});
				} else {
					res.render ("tasks-new", {contexts: contextList, projects: projectList, user: req.user});
				}
			});
		}
	});
});


/***********************************
CREATE TASK Route
***********************************/
router.post ("/", isLoggedIn, function (req, res) {
	var newTask = {
		name: req.body.task.name,
		description: req.body.task.description,
		context: req.body.task.context,
		project: req.body.task.project,
		status: "Not Complete",
		user: req.user._id
	};

	Task.create (newTask, function (err, createdTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/tasks");
		}
	});
});


/***********************************
INDEX TASK Route (a.k.a list tasks)
***********************************/
router.get ("", isLoggedIn, function (req, res) {
	Task.find ({user: req.user._id, status: "Not Complete"}).populate ("context").populate ("project").exec (function (err, tasklist) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("tasks-list", {tasks: tasklist});
		}
	});
});


/***********************************
SHOW TASK Route
***********************************/
router.get ("/:id", isLoggedIn, function (req, res) {
	Task.findById ({_id: req.params.id}).populate ("context").populate ("project").exec (function (err, foundTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("tasks-show", {task: foundTask});
		}
	});
});


/***********************************
EDIT TASK Route
***********************************/
router.get ("/:id/edit", isLoggedIn, function (req, res) {
	Task.findById (req.params.id).populate ("context").populate ("project").exec (function (err, foundTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			Context.find ({user: req.user._id}, function (err, listOfContexts) {
				if (err) {
					res.render ("whoops", {error: err});
				} else {
					Project.find ({user: req.user._id}, function (err, listOfProjects) {
						if (err) {
							res.render ("whoops", {error: err});
						} else {
							res.render ("tasks-edit", {task: foundTask, contexts: listOfContexts, projects: listOfProjects});
						}
					});
				}
			});
		}
	});
});


/***********************************
UPDATE TASK Route
***********************************/
router.put ("/:id", isLoggedIn, function (req, res) {
	Task.findByIdAndUpdate (req.params.id, req.body.task, function (err, updatedTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/tasks/" + req.params.id);
		}
	});
});


/***********************************
DELETE TASK Route
***********************************/
router.delete ("/:id", isLoggedIn, function (req, res) {
	Task.findByIdAndRemove (req.params.id, function (err) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/tasks");
		}
	});
});


router.get ("/:id/complete", isLoggedIn, function (req, res) {
	Task.findByIdAndUpdate (req.params.id, {status: "Complete"}, function (err, updatedTask) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/tasks");
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
