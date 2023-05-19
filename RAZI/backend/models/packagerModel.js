var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packagerSchema = new Schema({
	'number' : Number,
	'public' : Boolean,
	'active' : Boolean
});

module.exports = mongoose.model('packager', packagerSchema);
