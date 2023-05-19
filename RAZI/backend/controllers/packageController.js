var PackageModel = require('../models/packageModel.js');
var UserModel = require('../models/userModel.js');

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
		var number = req.body.number;

		// Preveri ali je podana številka za paketnik že v bazi
		PackageModel.findOne({ number: number }, function (err, existingPackage) {
			if (err) {
				return res.status(500).json({
					message: 'Error when finding package',
					error: err
				});
			}
	
			if (existingPackage) {
				return res.status(409).json({
					message: 'Package number already exists'
				});
			}

			var package = new PackageModel({
				number : number,
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

			if (req.body.number && req.body.number !== package.number) {
				// Preveri ali je podana številka za paketnik že v bazi
				PackageModel.findOne({ number: req.body.number }, function (err, existingPackage) {
					if (err) {
						return res.status(500).json({
							message: 'Error when finding package',
							error: err
						});
					}
	
					if (existingPackage) {
						return res.status(409).json({
							message: 'Package number already exists'
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
			}
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

            // Vsem uporabnikom odstrani izbrisan paketnik
			UserModel.updateMany({ packages: { $in: [package._id] } }, { $pull: { packages: package._id } }, function (err, result) {
				if (err) {
					return res.status(500).json({
						message: 'Error when updating users.',
						error: err
					});
				}

				return res.status(204).json({});
			});
        });
    }
};