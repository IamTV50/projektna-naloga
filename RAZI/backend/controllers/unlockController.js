var UnlockModel = require('../models/unlockModel.js');

module.exports = {
    list: function (req, res) {
        UnlockModel.find(function (err, unlocks) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting unlock.',
                    error: err
                });
            }

            return res.json(unlocks);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        UnlockModel.findOne({_id: id}, function (err, unlock) {
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

            return res.json(unlock);
        });
    },

    create: function (req, res) {
        var unlock = new UnlockModel({
			package : req.body.package,
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

            unlock.package = req.body.package ? req.body.package : unlock.package;
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
