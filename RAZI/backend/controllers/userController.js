var UserModel = require('../models/userModel.js');
var PackagerModel = require('../models/packagerModel.js');
var RequestModel = require('../models/requestModel.js');
const fs = require('fs');
const { spawn } = require('child_process');
const path = require('path');

module.exports = {

    // prikaz podatkov povezanih z uporabniki
    list: function (req, res) {
        UserModel.find().populate("packagers").exec(function (err, users) {
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

        UserModel.findOne({_id: id}).populate("packagers").exec(function (err, user) {
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
			.populate("packagers")
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
		var email = req.body.email;

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

			UserModel.findOne({ email: email }, function (err, existingEmail) {
				if (err) {
					return res.status(500).json({
						message: 'Error when finding existing user',
						error: err
					});
				}
		  
				if (existingEmail) {
					return res.status(409).json({
						message: 'Email already exists'
					});
				}

				var user = new UserModel({
					username : username,
					password : req.body.password,
					email : email,
					admin : false,
					packagers : []
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

	myPackagers: function (req, res) {
		var id = req.session.userId;

        // Find all packagers where the owner is the specified user ID
		PackagerModel.find({ owner: id }, function (err, packagers) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting packagers.',
					error: err
				});
			}

			//console.log(packagers);

			// Get an array of packager IDs
			var packagerIds = packagers.map(function (packager) {
				return packager._id;
			});

			// Find all users that have any of the packager IDs in their packagers array
			UserModel.find({ packagers: { $in: packagerIds }, admin: false  })
				.populate("packagers")
				.select('-password') // Exclude the 'password' field from the result
				.exec(function (err, users) {
					if (err) {
						return res.status(500).json({
							message: 'Error when getting users.',
							error: err
						});
					}

					return res.json(users);
				});
		});
    },

	// Save video as userId.mp4
	registerFace: function (req, res) {
		console.log("Called registerFace");

		const scriptPath = path.join(__dirname, '../public/python/train_model.py');
		var dataToSend = "";

		var id = req.body.id;
		var video = req.file;

		if (!video) {
			return res.status(400).json({ error: 'No MP4 file uploaded.' });
		}

		fs.renameSync(video.path, 'public/python/tmp_videos/' + id + '.mp4');

		console.log("Started python script");

		const pythonProcess = spawn('python3', [scriptPath, id]);

		pythonProcess.stdout.on('data', function (data) {
			console.log('Pipe data from python script ...');
			dataToSend += data.toString();
			console.log(dataToSend);
		});

		pythonProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		pythonProcess.on('error', (error) => {
			console.error(`error: ${error.message}`);
		});

		pythonProcess.on('close', (code) => {
			console.log(`child process close all stdio with code ${code}`);
			if (code === 0) {
				return res.status(200).json({ message: 'MP4 file uploaded and processed successfully.' });
			}
			return res.status(500).json({
				message: 'Error when running python script.',
				error: "Python script returned error code " + code
			});
		});
    },

	// Save image as userId.jpg
	faceId: function (req, res) {
		console.log("Called faceId");

		const scriptPath = path.join(__dirname, '../public/python/test_img_on_model.py');
    
		var id = req.body.id;
		var image = req.file;

		if (!image) {
			return res.status(400).json({ error: 'No JPG file uploaded.' });
		}
	  
		fs.renameSync(image.path, 'public/python/tmp_images/' + id + '.jpg');

		console.log("Started python script");
		// Call python file and check if image matches model
		// return res.status(200).json({ message: 'JPG file uploaded successfully.' });
		const pythonProcess = spawn('python3', [scriptPath, id]);

		pythonProcess.stdout.on('data', function (data) {
			console.log('Pipe data from python script ...');
			console.log(data.toString());
		});

		pythonProcess.stderr.on("data", (data) => {
			console.error(`stderr: ${data}`);
		});

		pythonProcess.on('error', (error) => {
			console.error(`error: ${error.message}`);
		});

		pythonProcess.on('close', (code) => {
			console.log(`child process close all stdio with code ${code}`);
			if (code === 10) {
				return res.status(200).json({ message: 'Image uploaded and processed successfully.' });
			} else if (code === 20) {
				return res.status(401).json({ message: 'Image does not match model.' });
			}
			return res.status(500).json({
				message: 'Error when running python script.',
				error: "Python script returned error code " + code
			});
		});
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
			user.admin = req.body.admin == undefined ? req.body.admin : user.admin;
			user.packagers = req.body.packagers ? req.body.packagers : user.packagers;
			
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
	addPackager: function (req, res) {
        var username = req.body.username;
		var packagerNumber = req.body.packagerNumber;

		PackagerModel.findOne({number: packagerNumber}, function (err, packager) {
			if (err) {
                return res.status(500).json({
                    message: 'Error when getting packager.',
                    error: err
                });
            }

            if (!packager) {
                return res.status(404).json({
                    message: 'No such packager'
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

				var packagerIndex = user.packagers.indexOf(packager._id);

				if (packagerIndex > -1) {
					return res.status(404).json({
						message: `User already contains packager ${packager.number}`
					});
				}

				user.packagers.push(packager._id);
				
				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: 'Error when updating user.',
							error: err
						});
					}

					if (!packager.owner && !packager.public && !user.admin) {
						packager.owner = user._id

						packager.save(function (err, packager) {
							if (err) {
								return res.status(500).json({
									message: 'Error when updating packager.',
									error: err
								});
							}

							// Exclude the password field from the user object
							const { password, ...userWithoutPassword } = user.toObject();
							return res.json(userWithoutPassword);
						});
					} else {
						// Exclude the password field from the user object
						const { password, ...userWithoutPassword } = user.toObject();
						return res.json(userWithoutPassword);
					}
				});
			});
		});
    },

	// Vpiši uporabniško ime in številko paketnika, ter odstrani paketnik od uporabnika
	removePackager: function (req, res) {
        var username = req.body.username;
		var packagerNumber = req.body.packagerNumber;

		PackagerModel.findOne({ number: packagerNumber }, function (err, packager) {
			if (err) {
                return res.status(500).json({
                    message: 'Error when getting packager.',
                    error: err
                });
            }

            if (!packager) {
                return res.status(404).json({
                    message: 'No such packager'
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

				var packagerIndex = user.packagers.indexOf(packager._id);

				if (packagerIndex <= -1) {
					return res.status(404).json({
						message: `User does not contain packager ${packager.number}`
					});
				}

				user.packagers.splice(packagerIndex, 1);
				
				user.save(function (err, user) {
					if (err) {
						return res.status(500).json({
							message: 'Error when updating user.',
							error: err
						});
					}

					if (packager.owner && packager.owner.equals(user._id)) {
						packager.owner = null

						packager.save(function (err, packager) {
							if (err) {
								return res.status(500).json({
									message: 'Error when updating packager.',
									error: err
								});
							}

							// Exclude the password field from the user object
							const { password, ...userWithoutPassword } = user.toObject();
							return res.json(userWithoutPassword);
						});
					} else {
						// Exclude the password field from the user object
						const { password, ...userWithoutPassword } = user.toObject();
						return res.json(userWithoutPassword);
					}
				});
			});
		});
    },

    remove: function (req, res) {
        var id = req.session.userId;

		PackagerModel.updateMany({ owner: id }, { $set: { owner: null } }, function(err) {
			if (err) {
				return res.status(500).json({
					message: 'Error when updating packagers.',
					error: err
				});
			}
	
			RequestModel.deleteMany({ user: id }, function (err) {
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
							} else {
								return res.status(204).json({});
							}
						});
					}
				});
			});
		});
	},

	adminRemove: function (req, res) {
        var id = req.params.id;

		PackagerModel.updateMany({ owner: id }, { $set: { owner: null } }, function(err) {
			if (err) {
				return res.status(500).json({
					message: 'Error when updating packagers.',
					error: err
				});
			}

			RequestModel.deleteMany({ user: id }, function (err) {
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

					return res.status(204).json({});
				});
			});
		});
    }
};
