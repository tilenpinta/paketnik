const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController.js');

function requiresCustomer(req, res, next) {
    if (req.session && req.session.userId && req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}
/*
 * GET
 */
router.get('/', requiresCustomer, itemController.list);
router.get('/addItem', requiresCustomer, itemController.showAddItem);

/*
 * GET
 */
router.get('/:id', itemController.show);

/*
 * POST
 */
router.post('/', itemController.create);
router.post('/addItem', requiresCustomer, itemController.addItem);
/*
 * PUT
 */
router.put('/:id', itemController.update);

/*
 * DELETE
 */
router.delete('/:id', itemController.remove);

module.exports = router;
