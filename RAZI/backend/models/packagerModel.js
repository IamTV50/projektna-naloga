var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packagerSchema = new Schema({
	'number' : Number,
	'public' : Boolean,
	'active' : Boolean,
	'owner' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   }
});

module.exports = mongoose.model('packager', packagerSchema);
