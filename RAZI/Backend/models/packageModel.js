var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var packageSchema = new Schema({
	'number' : Number
});

module.exports = mongoose.model('package', packageSchema);
