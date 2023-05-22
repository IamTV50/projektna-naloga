var UnlockModel = require('../models/unlockModel.js');

module.exports = {
    list: function (req, res) {
        UnlockModel.find().populate("user").populate("packager").exec(function (err, unlocks) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting unlock.',
                    error: err
                });
            }

			// Remove passwords from each user object
			unlocks = unlocks.map(function (unlock) {
				unlock = unlock.toObject(); // Convert Mongoose document to plain JavaScript object
				if (unlock.user) {
					delete unlock.user.password;
				}
				return unlock;
			});

            return res.json(unlocks);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        UnlockModel.findOne({_id: id}).populate("user").populate("packager").exec(function (err, unlock) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting unlock.',
                    error: err
                });
            }

            if (!unlock) {
                return res.status(404).json({
                    message: 'No such unlock'
                });
            }

			// Remove password from user object
			if (unlock.user) {
				unlock = unlock.toObject(); // Convert Mongoose document to plain JavaScript object
				delete unlock.user.password;
			}

            return res.json(unlock);
        });
    },
    
	userUnlocks: function (req, res) {
		var userId = req.params.userId;
	
		UnlockModel.find({'user': userId})
			.populate("user")
			.populate("packager")
			.sort({'openedOn': -1}) // Sort by openedOn in descending order (newer first)
			.exec(function (err, unlocks) {
			if (err) {
				return res.status(500).json({
					message: 'Error when getting unlocks.',
					error: err
				});
			}
	
			if (!unlocks || unlocks.length === 0) {
				return res.status(404).json({
					message: 'No unlocks found for the user.'
				});
			}
	
			// Remove password from user objects
			unlocks = unlocks.map(function (unlock) {
				unlock = unlock.toObject(); // Convert Mongoose document to plain JavaScript object
				if (unlock.user) {
					delete unlock.user.password;
				}
				return unlock;
			});
	
			return res.json(unlocks);
		});
	},

    create: function (req, res) {
        var unlock = new UnlockModel({
			packager : req.body.packager,
			user : req.body.user,
			success : req.body.success,
			status : req.body.status,
			openedOn : Date.now()
        });

        unlock.save(function (err, unlock) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating unlock',
                    error: err
                });
            }

            return res.status(201).json(unlock);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        UnlockModel.findOne({_id: id}, function (err, unlock) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting unlock',
                    error: err
                });
            }

            if (!unlock) {
                return res.status(404).json({
                    message: 'No such unlock'
                });
            }

            unlock.packager = req.body.packager ? req.body.packager : unlock.packager;
			unlock.user = req.body.user ? req.body.user : unlock.user;
			unlock.success = req.body.success ? req.body.success : unlock.success;
			unlock.status = req.body.status ? req.body.status : unlock.status;
			unlock.openedOn = req.body.openedOn ? req.body.openedOn : unlock.openedOn;
			
            unlock.save(function (err, unlock) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating unlock.',
                        error: err
                    });
                }

                return res.json(unlock);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        UnlockModel.findByIdAndRemove(id, function (err, unlock) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the unlock.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
