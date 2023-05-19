var RequestModel = require('../models/requestModel.js');
var PackageModel = require('../models/packageModel.js');
var UserModel = require('../models/userModel.js');

module.exports = {
    list: function (req, res) {
        RequestModel.find().sort({ created: 'desc' }).populate("user").populate("package").exec(function (err, requests) {
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

        RequestModel.findOne({_id: id}).populate("user").populate("package").exec(function (err, request) {
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

            return res.json(request);
        });
    },

    create: function (req, res) {
        var request = new RequestModel({
			user : req.body.user,
			package : req.body.package,
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

	userRequestPackage: function (req, res) {
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

			var request = new RequestModel({
				user : req.session.userId,
				package : package._id,
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
			request.package = req.body.package ? req.body.package : request.package;
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

            return res.status(204).json();
        });
    }
};
