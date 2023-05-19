var UserModel = require('../models/userModel.js');
var PackageModel = require('../models/packageModel.js');
var RequestModel = require('../models/requestModel.js');

module.exports = {

    // prikaz podatkov povezanih z uporabniki
    list: function (req, res) {
        UserModel.find().populate("packages").exec(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

			// Remove passwords from each user object
			users = users.map(function(user) {
				user = user.toObject(); // Convert Mongoose document to plain JavaScript object
				delete user.password;
				return user;
			});

            return res.json(users);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}).populate("packages").exec(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

			// Exclude the password field from the user object
			const { password, ...userWithoutPassword } = user.toObject();
			return res.json(userWithoutPassword);
        });
    },

    profile: function(req, res, next){
        UserModel.findById(req.session.userId)
            .exec(function(error, user){
                if(error){
                    return next(error);
                } else{
                    if(user===null){
                        const err = new Error('Not authorized, go back!');
                        err.status = 400;
                        return next(err);
                    } else{
                        // Exclude the password field from the user object
						const { password, ...userWithoutPassword } = user.toObject();
						return res.json(userWithoutPassword);
                    }
                }
            });
    },

    // Avtorizacija uporabnika
    create: function (req, res) {
		var username = req.body.username;

		// Preveri ali uporabniško ime že obstaja
		UserModel.findOne({ username: username }, function (err, existingUser) {
			if (err) {
				return res.status(500).json({
					message: 'Error when finding existing user',
					error: err
				});
			}

			if (existingUser) {
				return res.status(409).json({
					message: 'Username already exists'
				});
			}

			var user = new UserModel({
				username : username,
				password : req.body.password,
				email : req.body.email,
				admin : false,
				packages : []
			});

			user.save(function (err, user) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating user',
						error: err
					});
				}

				return res.status(201).json(user);
			});
		});
    },

    login: function(req, res, next){
        console.log("on login " + req.body.username + " " + req.body.password)
        UserModel.authenticate(req.body.username, req.body.password, function(err, user){
            if(err || !user){
                console.log("on error " + err)
                console.log("on error " + user)
                var err = new Error('Wrong username or password');
                err.status = 401;
                return res.status(401).json({
                    message: 'Wrong username or password',
                    error: err
                });
            }
            req.session.userId = user._id;
			
			// Exclude the password field from the user object
			const { password, ...userWithoutPassword } = user.toObject();
			return res.json(userWithoutPassword);
        });
    },

    logout: function(req, res, next){
        if (req.session) {
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.status(201).json({});
                }
            });
        }
    },

    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.email = req.body.email ? req.body.email : user.email;
			user.admin = req.body.admin ? req.body.admin : user.admin;
			user.packages = req.body.packages ? req.body.packages : user.packages;
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

				// Exclude the password field from the user object
				const { password, ...userWithoutPassword } = user.toObject();
				return res.json(userWithoutPassword);
            });
        });
    },

	// Vpiši uporabniško ime in številko paketnika, ter dodaj paketnik uporabniku
	addPackage: function (req, res) {
        var username = req.body.username;
		var packageNumber = req.body.packageNumber;

		PackageModel.findOne({number: packageNumber}, function (err, package) {
			if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

			UserModel.findOne({username: username}, function (err, user) {
				if (err) {
					return res.status(500).json({
						message: 'Error when getting user',
						error: err
					});
				}

				if (!user) {
					return res.status(404).json({
						message: 'No such user'
					});
				}

				var packageIndex = user.packages.indexOf(package._id);

				if (packageIndex > -1) {
					return res.status(404).json({
						message: `User already contains package ${package.number}`
					});
				}

				user.packages.push(package._id);
				
				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: 'Error when updating user.',
							error: err
						});
					}

					// Exclude the password field from the user object
					const { password, ...userWithoutPassword } = user.toObject();
					return res.json(userWithoutPassword);
				});
			});
		});
    },

	// Vpiši uporabniško ime in številko paketnika, ter odstrani paketnik od uporabnika
	removePackage: function (req, res) {
        var username = req.body.username;
		var packageNumber = req.body.packageNumber;

		PackageModel.findOne({ number: packageNumber }, function (err, package) {
			if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

			UserModel.findOne({username: username}, function (err, user) {
				if (err) {
					return res.status(500).json({
						message: 'Error when getting user',
						error: err
					});
				}

				if (!user) {
					return res.status(404).json({
						message: 'No such user'
					});
				}

				var packageIndex = user.packages.indexOf(package._id);

				if (packageIndex <= -1) {
					return res.status(404).json({
						message: `User does not contain package ${package.number}`
					});
				}

				user.packages.splice(packageIndex, 1);
				
				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: 'Error when updating user.',
							error: err
						});
					}

					// Exclude the password field from the user object
					const { password, ...userWithoutPassword } = user.toObject();
					return res.json(userWithoutPassword);
				});
			});
		});
    },

    remove: function (req, res) {
        var id = req.session.userId;

		RequestModel.deleteMany({ user: userId }, function (err) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting requests.',
                    error: err
                });
            }

			UserModel.findByIdAndRemove(id, function (err, user) {
				if (err) {
					return res.status(500).json({
						message: 'Error when deleting the user.',
						error: err
					});
				}

				if (req.session) {
					req.session.destroy(function(err) {
						if (err) {
							return next(err);
						} else{
							return res.status(204).json({});
						}
					});
				}
			});
		});
    }
};
