var RequestModel = require('../models/requestModel.js');

module.exports = {
    list: function (req, res) {
        RequestModel.find(function (err, requests) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting request.',
                    error: err
                });
            }

            return res.json(requests);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        RequestModel.findOne({_id: id}, function (err, request) {
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
			created : req.body.created
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
