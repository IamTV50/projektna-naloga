var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var requestSchema = new Schema({
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'packager' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'packager'
	},
	'reason' : String,
	'created' : Date
});

module.exports = mongoose.model('request', requestSchema);
