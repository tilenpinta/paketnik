const mailboxModel = require('../models/mailboxModel.js');
const tokenModel = require('../models/tokenModel.js');
const request = require('request');

/**
 * mailboxController.js
 *
 * @description :: Server-side logic for managing mailboxs.
 */
module.exports = {

    /**
     * mailboxController.list()
     */
    list: function (req, res) {
        mailboxModel.find(function (err, mailboxes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            }
            return res.json(mailboxes);
        });
    },

    /**
     * mailboxController.show()
     */
    show: function (req, res) {
        let id = req.params.id;
        mailboxModel.findOne({registrationId: id}, function (err, mailboxes) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            } else if (!mailboxes) {
                return res.status(404).json({
                    message: 'No such mailbox...'
                });
            }
            return res.json(mailboxes);
        });
    },

    showRegistration: function (req, res) {
        res.render('mailbox/paketnik-register');
    },

    /**
     * Preko te metode lahko samo admin dodaja nove paketnike
     */
    create: function (req, res) {
        const mailbox = new mailboxModel({
			registrationId : req.body.registrationId,
            unlockKey : req.body.unlockKey,
            ownerId : "",
            courierId : "",
            requireUnlock : false, // privzeto nihce ne zahteva odklep
            isLocked: true // privzeto je paketnik zaklenjen
        });

        mailbox.save(function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating mailbox',
                    error: err
                });
            }
            return res.status(201).json(mailbox);
        });
    },

    /**
     * Funkcija, ki "poveze" prijavljenega uporabnika z njegovim paketnikom
     * Shrani _id prijavljenega uporabnika v modelu Mailbox v primeru uspešne registracije paketnika
     *
     * @param req preko zahteve pride id za registracijo paketnika (registrationId v modelu Mailbox)
     * @param res vrnemo potrditev o uspesni registraciji / o napaki / usmerimo uporabnika na stran za prijavo
     * @param next
     */
    register: function (req, res,next) {
        if (req.session.userId) {
            mailboxModel.validation(req.body.registrationId, (error, mailbox) => {
                if (error || !mailbox) {
                    let err = new Error("Id" + req.body.registrationId);
                    err.status = 401;
                    return next(err);
                } else {
                    mailbox.ownerId = req.session.userId ? req.session.userId : mailbox.ownerId;
                    mailbox.save(err => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating mailbox.',
                                error: err
                            });
                        }
                        res.render('mailbox/naive-response', { response:  mailbox })
                        //return res.status(201).json("Uspesno ste registrirali vas paketnik");
                    });
                }
            });
        }
        else {
            res.redirect('../../users/login');
        }
    },

    showInsertToken: (req, res) => {
        res.render('mailbox/insert-token');
    },

    /**
     * mailboxController.update()
     */
    update: function (req, res) {
        const id = req.params.id;
        mailboxModel.findOne({_id: id}, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox',
                    error: err
                });
            }
            if (!mailbox) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }

            mailbox.registrationId = req.body.registrationId ? req.body.registrationId : mailbox.registrationId;
			mailbox.unlockKey = req.body.unlockKey ? req.body.unlockKey : mailbox.unlockKey;

            mailbox.save(function (err, mailbox) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating mailbox.',
                        error: err
                    });
                }

                return res.json(mailbox);
            });
        });
    },

    /**
     * mailboxController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        mailboxModel.findByIdAndRemove(id, function (err, mailbox) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the mailbox.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    showAddMailbox: (req, res) => {
        res.render('mailbox/add-mailbox');
    }
};
