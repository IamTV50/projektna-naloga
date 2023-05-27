var RequestModel = require('../models/requestModel.js');
var PackagerModel = require('../models/packagerModel.js');
var UserModel = require('../models/userModel.js');

module.exports = {
    list: function (req, res) {
        RequestModel.find().sort({ created: 'desc' }).populate("user").populate("packager").exec(function (err, requests) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting request.',
                    error: err
                });
            }

			// Remove passwords from each user object
			requests = requests.map(function (request) {
				request = request.toObject(); // Convert Mongoose document to plain JavaScript object
				if (request.user) {
					delete request.user.password;
				}
				return request;
			});

            return res.json(requests);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        RequestModel.findOne({_id: id}).populate("user").populate("packager").exec(function (err, request) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting request.',
                    error: err
                });
            }

            if (!request) {
                return res.status(404).json({
                    message: 'No such request'
                });
            }

			// Remove password from user object
			if (request.user) {
				request = request.toObject(); // Convert Mongoose document to plain JavaScript object
				delete request.user.password;
			}

            return res.json(request);
        });
    },

    userRequestsList: function (req, res) {
        var userId = req.params.id;

        RequestModel.find({user: userId}).populate("user").populate("packager").sort({ created: 'desc' }).exec(function (err, requests) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting request.',
                    error: err
                });
            }

            if (!requests) {
                return res.status(404).json({
                    message: 'No requests for this user'
                });
            }

            // Remove passwords from each user object
            requests = requests.map(function (request) {
                request = request.toObject(); // Convert Mongoose document to plain JavaScript object
                if (request.user) {
                    delete request.user;
                }
                return request;
            })

            return res.json(requests);
        });
    },

    create: function (req, res) {
        var request = new RequestModel({
			user : req.body.user,
			packager : req.body.packager,
			reason : req.body.reason,
			created : Date.now()
        });

        request.save(function (err, request) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating request',
                    error: err
                });
            }

            return res.status(201).json(request);
        });
    },

	userRequestPackager: function (req, res) {
		var packagerNumber = req.body.packagerNumber;

		PackagerModel.findOne({number: packagerNumber}, function (err, packager) {
			if (err) {
                console.log("Error when getting packager")
                return res.status(500).json({

                    message: 'Error when getting packager.',
                    error: err
                });
            }

            if (!packager) {
                console.log("No such packager" + packagerNumber)
                return res.status(404).json({
                    message: 'No such packager'
                });
            }

			var request = new RequestModel({
				user : req.session.userId,
				packager : packager._id,
				reason : req.body.reason,
				created : Date.now()
			});

			request.save(function (err, request) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating request',
						error: err
					});
				}

                // populate-am request z user in packager
                RequestModel.findOne({_id: request._id}).populate("user").populate("packager").exec(function (err, request) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting request.',
                            error: err
                        });
                    }

					// Remove password from user object
					if (request.user) {
						request = request.toObject(); // Convert Mongoose document to plain JavaScript object
						delete request.user.password;
					}

                    return res.status(201).json(request);
                });
			});
		});
    },

    update: function (req, res) {
        var id = req.params.id;

        RequestModel.findOne({_id: id}, function (err, request) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting request',
                    error: err
                });
            }

            if (!request) {
                return res.status(404).json({
                    message: 'No such request'
                });
            }

            request.user = req.body.user ? req.body.user : request.user;
			request.packager = req.body.packager ? req.body.packager : request.packager;
			request.reason = req.body.reason ? req.body.reason : request.reason;
			request.created = req.body.created ? req.body.created : request.created;
			
            request.save(function (err, request) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating request.',
                        error: err
                    });
                }

                return res.json(request);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        RequestModel.findByIdAndRemove(id, function (err, request) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the request.',
                    error: err
                });
            }

            return res.status(204).json({});
        });
    }
};
