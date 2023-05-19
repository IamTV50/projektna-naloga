var PackageModel = require('../models/packageModel.js');

module.exports = {
    list: function (req, res) {
        PackageModel.find(function (err, packages) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package.',
                    error: err
                });
            }

            return res.json(packages);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
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

            return res.json(package);
        });
    },

    create: function (req, res) {
        var package = new PackageModel({
			number : req.body.number,
			public : req.body.public,
			active : true
        });

        package.save(function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating package',
                    error: err
                });
            }

            return res.status(201).json(package);
        });
    },

    update: function (req, res) {
        var id = req.params.id;

        PackageModel.findOne({_id: id}, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting package',
                    error: err
                });
            }

            if (!package) {
                return res.status(404).json({
                    message: 'No such package'
                });
            }

            package.number = req.body.number ? req.body.number : package.number;
			package.public = req.body.public ? req.body.public : package.public;
			package.active = req.body.active ? req.body.active : package.active;
			
            package.save(function (err, package) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating package.',
                        error: err
                    });
                }

                return res.json(package);
            });
        });
    },

    remove: function (req, res) {
        var id = req.params.id;

        PackageModel.findByIdAndRemove(id, function (err, package) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the package.',
                    error: err
                });
            }

            return res.status(204).json({});
        });
    }
};
