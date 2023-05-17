var UserModel = require('../models/userModel.js');

module.exports = {

    // prikaz podatkov povezanih z uporabniki
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }

            return res.json(users);
        });
    },

    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, user) {
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

            return res.json(user);
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
                        return res.json(user);
                    }
                }
            });
    },

    // Avtorizacija uporabnika
    create: function (req, res) {
        var user = new UserModel({
			username : req.body.username,
			password : req.body.password,
			email : req.body.email,
			admin : false
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
            return res.json(user);
        });
    },

    logout: function(req, res, next){
        if(req.session){
            req.session.destroy(function(err){
                if(err){
                    return next(err);
                } else{
                    //return res.redirect('/');
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
			
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    remove: function (req, res) {
        var id = req.session.userId;


        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            if(req.session){
                req.session.destroy(function(err){
                    if(err){
                        return next(err);
                    } else{
                        //return res.redirect('/');
                        return res.status(204).json({});
                    }
                });
            }
        });
    }
};
