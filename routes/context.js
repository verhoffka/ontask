var express = require ("express");
var router = express.Router ({mergeParams: true});

var Context = require ("../models/context");
var Task = require ("../models/task");
var User = require ("../models/user");


/***********************************
INDEX CONTEXT Route (a.k.a list tasks)
***********************************/
router.get ("/", isLoggedIn,  function (req, res) {
	Context.find ({user: req.user._id}, function (err, contextID) {
		if (err) {
			res.redirect ("/whoops", {error: err});
		} else {
			res.render ("contexts-list", {contexts: contextID});
		}
	});
});


/***********************************
NEW CONTEXT Route
***********************************/
router.get ("/new", isLoggedIn,  function (req, res) {
	res.render ("contexts-new");
});


/***********************************
CREATE CONTEXT Route
***********************************/
router.post ("/", isLoggedIn,  function (req, res) {
	var newContext = {
		name: req.body.context.name,
		description: req.body.context.description,
		user: req.user._id
	};

	Context.create (newContext, function (err, createdContext) {
		if (err) {
			res.redirect ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/contexts");
		}
	});
});


/***********************************
SHOW CONTEXT Route
***********************************/
router.get ("/:id", isLoggedIn,  function (req, res){
	Task.find ({context: req.params.id, status: "Not Complete"}).populate ("project").exec (function (err, taskList) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("contexts-show", {tasks: taskList, context: req.params.id});
		}
	});
});


/***********************************
EDIT CONTEXT Route
***********************************/
router.get ("/:id/edit", isLoggedIn,  function (req, res) {
	Context.findById (req.params.id, function (err, foundContext) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.render ("contexts-edit", {context: foundContext});
		}
	});
});


/***********************************
UPDATE CONTEXT Route
***********************************/
router.put ("/:id", isLoggedIn,  function (req, res) {
	Context.findByIdAndUpdate (req.params.id, req.body.context, function (err, updatedProject) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/contexts/" + req.params.id);
		}
	});
});


/***********************************
DELETE CONTEXT Route
***********************************/
router.delete ("/:id", isLoggedIn, function (req, res) {
	Context.findByIdAndRemove (req.params.id, function (err) {
		if (err) {
			res.render ("whoops", {error: err});
		} else {
			res.redirect (config.suburl + "/contexts");
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
