const mailboxModel = require('../models/mailboxModel.js');

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
            }
            if (!mailboxes) {
                return res.status(404).json({
                    message: 'No such mailbox'
                });
            }
            return res.json(mailboxes);
        });
    },

    showRegistration: function (req, res) {
        res.render('mailbox/paketnikReg');
    },

    /**
     * mailboxController.create()
     */
    create: function (req, res) {
        var mailbox = new mailboxModel({
			registrationId : req.body.registrationId,
			unlockKey : req.body.unlockKey,
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
                        return res.json("Uspesno ste registrirali vas paketnik");
                    });
                }
            });
        }
        else {
            res.redirect('../../users/login');
        }
    },
    /**
     * mailboxController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
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
    }
};
