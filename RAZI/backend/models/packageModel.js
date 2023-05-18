var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageSchema = new Schema({
	'number' : Number,
	'active' : Boolean
});

module.exports = mongoose.model('package', packageSchema);
