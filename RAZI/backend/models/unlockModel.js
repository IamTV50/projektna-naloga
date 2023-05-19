var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var unlockSchema = new Schema({
	'packager' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'packager'
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
