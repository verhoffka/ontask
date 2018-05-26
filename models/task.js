var mongoose = require ("mongoose");

var schemaTask = new mongoose.Schema ({
	name: String,
	description: String,
	context: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Context"
	},
	dateCreate: {
		type: Date,
		default: Date.now
	},
	project: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Project"
	},
	status: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model ("Task", schemaTask);