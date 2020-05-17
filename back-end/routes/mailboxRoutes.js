var express = require('express');
var router = express.Router();
var mailboxController = require('../controllers/mailboxController.js');

/*
 * GET
 */
router.get('/',mailboxController.list);

/*
 * GET
 */
router.get('/register', mailboxController.showRegistration);
router.get('/:id', mailboxController.show);
/*
 * POST
 */
//router.post('/', mailboxController.create);
router.post('/register', mailboxController.register);

/*
 * PUT
 */
router.put('/:id', mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', mailboxController.remove);

module.exports = router;
