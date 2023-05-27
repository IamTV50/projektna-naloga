var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'password' : String,
	'email' : String,
	'admin' : Boolean,
	'packagers' : [{
	 	type: Schema.Types.ObjectId,
	 	ref: 'packager'
	}]
});

// Tukaj se geslo hash-ira preden se user ustvari
userSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();
	
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}

		user.password = hash;
		next();
	});
});

// Tukaj preverimo ali se podano geslo in shranjeno geslo (oboje hash) ujemata preko uporabnikškega imena
userSchema.statics.authenticate = function(username, password, callback) {
	User.findOne({username: username}).exec(function(err, user) {
		if (err) {
			return callback(err);
		} else if (!user) {
			var err = new Error("User not found.");
			err.status = 401;
			return callback(err);
		}

		bcrypt.compare(password, user.password, function(err, result) {
			if (result === true) {
				return callback(null, user);
			} else {
				return callback();
			}
		});
	});
}

var User = mongoose.model('user', userSchema);
module.exports = User;
