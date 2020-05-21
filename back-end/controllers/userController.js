const userModel = require('../models/userModel.js');
const mailboxModel = require('../models/mailboxModel.js');
const tokenModel = require('../models/tokenModel.js');
const request = require('request')
const AdmZip = require('adm-zip');

const bcrypt = require('bcrypt');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        const id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
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

    create: (req, res) => {
        const userReq = new userModel({
			email : req.body.email,
			username : req.body.username,
			password : req.body.password,
            items : [],
            isOrdinaryUser: true,
            isAdmin: false

        });
        userModel.checkUser(userReq.username, userReq.email, (err, user) =>{
           if(user){
               return res.status(409).json("Uporabnik s tem e-naslovom ali uporabniskim imenom ze obstaja");
           }
           else if(!user){
               userReq.save( err => {
                   if (err) {
                       return res.status(500).json({
                           message: 'Error when creating user',
                           error: err
                       });
                   }
                   return res.status(201).json(userReq);
               });
           }
           else {
               return res.json("Fuck");
           }
        });

    },
    /**
     * userController.login()
     */
    showLogin: function (req, res) {
         res.render('user/login');
    }
    ,
    showRegister: function (req, res) {
        res.render('user/register');
    },

    login: function (req, res,next) {
        userModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (!(error || !user)) {
                req.session.userId = user._id;
                req.session.userAdmin = user.isAdmin;
                req.session.isOrdinaryUser = user.isOrdinaryUser;
                return res.status(201).json(user);
            } else {
                let err = new Error('Wrong username or password.');
                err.status = 401;
                return next(err);
            }
        })
    },
    /**
     * userController.login()
     */

    logout: function (req, res,next) {
        console.log("Iz logut: " + req.session.userId);
        if (req.session) {
            // delete session object
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.status(200);
                }
            });
        }
    },
        /**
     * userController.profil()
     */

    profile: function (req, res,next) {
            userModel.findById(req.session.userId)
                .exec(function (error, user) {
                    if (error) {
                        return next(error);
                    } else {
                        if (user === null) {
                            let err = new Error('Not authorized! Go back!');
                            err.status = 400;
                            return next(err);
                        } else {
                            res.render('user/profile', user);
                        }
                    }
                });
        },
    /**
     * userController.update()
     */
    update: function (req, res) {
        const id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
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

            user.email = req.body.email ? req.body.email : user.email;
			user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.isAdmin = false;
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

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    showAdminCreate: (req, res) => {
        res.render('user/admin-create');
    },
    showAdminDelete: (req, res) => {
        res.render('user/admin-delete');
    },
    showAdminUpdate: (req, res) => {
        res.render('user/admin-update');
    },

    adminCreate: (req, res) => {
        console.log(req.body.racun);
        let ordinaryUser = true;

        if(req.body.racun.toString() !== 'uporabnik'){
            ordinaryUser = false;
        }

        const userReq = new userModel({
            email : req.body.email,
            username : req.body.username,
            password : req.body.password,
            isOrdinaryUser: ordinaryUser,
            isAdmin: false

        });
        userModel.checkUser(userReq.username, userReq.email, (err, user) =>{
            if(user){
                return res.status(409).json("Uporabnik s tem e-naslovom ali uporabniskim imenom ze obstaja");
            }
            else if(!user){
                userReq.save( err => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user',
                            error: err
                        });
                    }
                    return res.status(201).json(userReq);
                });
            }
            else {
                return res.redirect('../../users/admin-create');
            }
        });
    },

    adminDelete: (req, res) => {
        const id = req.body.user_id;
        userModel.deleteOne({_id: id}, err => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    adminUpdate: (req, res) => {
        const id = req.body.user_id;
        console.log("Id od update uproabnika: " + id);

        let ordinaryUser = true;

        if(req.body.racun.toString() !== 'uporabnik'){
            ordinaryUser = false;
        }

        const setValues = {
            $set: {
                email: req.body.email, username: req.body.username,
                isOrdinaryUser: ordinaryUser, isAdmin: false
            }
        };
        const myquery = {_id: id};

        userModel.updateOne(myquery, setValues, (err, user) => {
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
            }else{
                return res.status(201).json(user);
            }
        });
    },

    showNotifications: (req, res) => {
        mailboxModel.findOne( {ownerId : req.session.userId}, (err, mailbox) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            } else if (!mailbox){
                return res.status(404).json({
                    message: 'Prosimo registrirajte vas paketnik',
                    error: err
                });
            } else if(mailbox){
                res.render('user/notifications', {box: mailbox});
            } else{
                return res.status(500).json({
                    message: 'Ooops nekaj je slo narobe',
                    error: err
                });
            }

        });
    },

    /**
     * preprosta metoda za odklepanje nabiralnika
     */
    unlockMailbox: (req, res) => {
        const id = req.params.id;
        mailboxModel.findOne( {unlockKey: id},  (err, mailbox) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            } else if (!mailbox){
                return res.status(404).json({
                    message: 'Prosimo registrirajte vas paketnik',
                    error: err
                });
            } else if(mailbox){
                if(mailbox.requireUnlock){
                    const urlString = 'http://api-test.direct4.me/Sandbox/PublicAccess/V1/api/access/OpenBox?boxID='
                        + mailbox.unlockKey + '&tokenFormat=2';

                    request.post(urlString,  (error, response) => {
                        let output = JSON.parse(response.body);
                        /**
                         * v primeru, da je paket najden, api nam vrne json odgovor, ki vsebuje
                         * base64String za .wav datoteko
                         */
                        if (error) {
                            return res.status(500).json({
                                message: 'Napaka pri zahtevi',
                                error: error
                            });
                        } else if (!error && response.statusCode === 200 && output.Result === 0) {
                            const ourDate = Date.now();
                            const fileSource = './public/audio/token' + ourDate + '.wav';
                            const zipSource = './public/audio/token' + ourDate + '.zip';
//    <source src="/public/../audio/token1590011668826.wav/token.wav" type="audio/wav">
                            const token = new tokenModel({
                                base64String : output.Data,
                                created : ourDate,
                                courierId : mailbox.courierId,
                                orderId: mailbox.orderId,
                                crap : fileSource
                            });
                            require("fs").writeFile(zipSource, output.Data, 'base64', function(err) {
                                const zip = new AdmZip(zipSource);
                                zip.extractAllTo(fileSource, true);

                                token.save( (err, token) => {
                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Error when creating token',
                                            error: err
                                        });
                                    }
                                    mailbox.requireUnlock = false;
                                    mailbox.isLocked = false;
                                    mailbox.courierId = '';
                                    mailbox.save( err => {
                                        if (err) {
                                            return res.status(500).json({
                                                message: 'Napaka',
                                                error: err
                                            });
                                        }
                                        return res.status(201).json('Zeton je poslan');
                                    });
                                });
                            });


                        }
                        /**
                         * v primeru, da paket s tem id ne obstaja
                         */
                        else if(!error && response.statusCode === 200 && output.Result === 10009) {
                            return res.status(404).json({
                                message: 'Paketnik ni najden'
                            });
                        } else if(!error && response.statusCode === 200 && output.Result !== 0 && output.Result !== 10009) {
                            return res.status(404).json({
                                message: output.Message
                            });
                        }  else {
                            return res.status(500).json({
                                message: 'Nepricakovana napaka',
                                error: err
                            });
                        }
                    });
                }
            }
        });
    }
};