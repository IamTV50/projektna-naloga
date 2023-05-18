var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var unlockSchema = new Schema({
	'package' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'package'
	},
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'success' : Boolean,
	'status' : String,
	'openedOn' : Date
});

module.exports = mongoose.model('unlock', unlockSchema);
