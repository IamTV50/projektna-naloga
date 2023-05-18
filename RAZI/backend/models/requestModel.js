var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var requestSchema = new Schema({
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'package' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'package'
	},
	'reason' : String,
	'created' : Date
});

module.exports = mongoose.model('request', requestSchema);
