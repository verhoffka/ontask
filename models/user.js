var mongoose = require ("mongoose");
var passportLocalMongoose = require ("passport-local-mongoose");

var schemaUser = new mongoose.Schema ({
	username: String,
	password: String,
	defaultProject: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	defaultContext: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Context"
	}
});

schemaUser.plugin (passportLocalMongoose);

module.exports = mongoose.model ("User", schemaUser);