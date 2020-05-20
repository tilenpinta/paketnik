const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const multer = require('multer');

const upload = multer({ dest: 'public/audios/' });

/**
 * "Privileged user" je admin. Lastnost admina nastavimo preko PB.
 */
function requiresPrivilegedUser(req, res, next) {
    console.log("Avtentikacija!");
    if (req.session && req.session.userId && req.session.userAdmin)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

function requiresCustomer(req, res, next) {
    console.log("Avtentikacija!");
    if (req.session && req.session.userId && req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop dovoljen samo uporabnikom!');
        err.status = 401;
        return next(err);
    }
}

router.get('/', userController.list);
router.get('/login', userController.showLogin);
router.get('/adminCreate', requiresPrivilegedUser, userController.showAdminCreate);
router.get('/adminDelete', requiresPrivilegedUser, userController.showAdminDelete);
router.get('/adminUpdate', requiresPrivilegedUser, userController.showAdminUpdate);
router.get('/notifications', requiresCustomer, userController.showNotifications);
router.get('/register', userController.showRegister);
router.get('/profile', userController.profile);
//router.get('/logout', userController.logout);  // TODO
router.get('/:id', userController.show);

router.post('/', userController.create);
router.post('/login', userController.login);
//router.post('/logout', userController.logout); // TODO
router.post('/createNewUser', requiresPrivilegedUser, userController.adminCreate);
router.post('/deleteUser', requiresPrivilegedUser, userController.adminDelete);
router.post('/updateUser', requiresPrivilegedUser, userController.adminUpdate);
router.post('/unlockMailbox/:id', requiresCustomer, userController.unlockMailbox);
/*
 * PUT
 */
router.put('/:id', userController.update);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
