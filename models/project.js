var mongoose = require ("mongoose");

var schemaProject = new mongoose.Schema ({
	name: String,
	description: String,
	project_num: String,
	charge_num: String,
	dateStart: {
		type: Date,
		default: Date.now
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	status: String
});

module.exports = mongoose.model ("Project", schemaProject);