var mongoose = require ("mongoose");

var schemaContext = new mongoose.Schema ({
	name: String,
	description: String,
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model ("Context", schemaContext);