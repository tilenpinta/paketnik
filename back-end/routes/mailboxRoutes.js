const express = require('express');
const router = express.Router();
const mailboxController = require('../controllers/mailboxController.js');

function requiresCustomer (req, res, next) {
    if (req.session && req.session.userId && req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

function requiresCourier(req, res, next) {
    if (req.session && req.session.userId && !req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

function requiresPrivilegedUser(req, res, next) {
    if (req.session && req.session.userId && req.session.userAdmin)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

router.get('/', requiresPrivilegedUser, mailboxController.list);
router.get('/addMailbox', requiresPrivilegedUser, mailboxController.showAddMailbox);
router.get('/register', requiresCustomer, mailboxController.showRegistration);
router.get('/token', requiresCourier, mailboxController.showInsertToken)
router.get('/:id', requiresPrivilegedUser, mailboxController.show);


//router.post('/', requiresPrivilegedUser, mailboxController.create); // TODO
router.post('/register',  requiresCustomer, mailboxController.register);
router.post('/createMailbox',  requiresPrivilegedUser, mailboxController.create);
/**
 * preko te metode bo dostavljalec zahteval, da uporabnik odklene paketnik
 */

/*
 * PUT
 */
router.put('/:id', mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', mailboxController.remove);

module.exports = router;

