var PackagerModel = require('../models/packagerModel.js');
var UserModel = require('../models/userModel.js');

module.exports = {
    list: function (req, res) {
        PackagerModel.find(function (err, packagers) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packager.',
                    error: err
                });
            }

            return res.json(packagers);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        PackagerModel.findOne({_id: id}, function (err, packager) {
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

            return res.json(packager);
        });
    },

    create: function (req, res) {
		var number = req.body.number;

		// Preveri ali je podana številka za paketnik že v bazi
		PackagerModel.findOne({ number: number }, function (err, existingPackager) {
			if (err) {
				return res.status(500).json({
					message: 'Error when finding packager',
					error: err
				});
			}
	
			if (existingPackager) {
				return res.status(409).json({
					message: 'Packager number already exists'
				});
			}

			var packager = new PackagerModel({
				number : number,
				public : req.body.public,
				active : true
			});

			packager.save(function (err, packager) {
				if (err) {
					return res.status(500).json({
						message: 'Error when creating packager',
						error: err
					});
				}

				return res.status(201).json(packager);
			});
		});
    },

    update: function (req, res) {
        var id = req.params.id;

        PackagerModel.findOne({_id: id}, function (err, packager) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting packager',
                    error: err
                });
            }

            if (!packager) {
                return res.status(404).json({
                    message: 'No such packager'
                });
            }

			if (req.body.number && req.body.number !== packager.number) {
				// Preveri ali je podana številka za paketnik že v bazi
				PackagerModel.findOne({ number: req.body.number }, function (err, existingPackager) {
					if (err) {
						return res.status(500).json({
							message: 'Error when finding packager',
							error: err
						});
					}
	
					if (existingPackager) {
						return res.status(409).json({
							message: 'Packager number already exists'
						});
					}

					packager.number = req.body.number ? req.body.number : packager.number;
					packager.public = req.body.public !== undefined  ? req.body.public : packager.public;
					packager.active = req.body.active !== undefined ? req.body.active : packager.active;
					
					packager.save(function (err, packager) {
						if (err) {
							return res.status(500).json({
								message: 'Error when updating packager.',
								error: err
							});
						}

						return res.status(201).json(packager);
					});
				});
			}
			else {
                packager.number = req.body.number ? req.body.number : packager.number;
                packager.public = req.body.public !== undefined  ? req.body.public : packager.public;
                packager.active = req.body.active !== undefined  ? req.body.active : packager.active;

                packager.save(function (err, packager) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating packager.',
                            error: err
                        });
                    }

                    return res.status(201).json(packager);
                });
            }
		});
    },

    remove: function (req, res) {
        var id = req.params.id;

        PackagerModel.findByIdAndRemove(id, function (err, packager) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the packager.',
                    error: err
                });
            }

            // Vsem uporabnikom odstrani izbrisan paketnik
			UserModel.updateMany({ packagers: { $in: [packager._id] } }, { $pull: { packagers: packager._id } }, function (err, result) {
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