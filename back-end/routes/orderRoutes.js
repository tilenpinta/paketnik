const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');


function requiresCustomer (req, res, next) {
    if (req.session && req.session.userId && req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen! Prijavite se kot uporabnik');
        err.status = 401;
        return next(err);
    }
}

function requiresCourier (req, res, next) {
    if (req.session && req.session.userId && !req.session.isOrdinaryUser)  {
        return next();
    } else {
        const err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

router.get('/checkForUndeliveredOrders', requiresCourier, orderController.showUndeliveredOrders);
router.get('/placeOrder', requiresCustomer, orderController.list);

/*
 * GET
 */
router.get('/:id', orderController.show);

/*
 * POST
 */
router.post('/placeOrder', requiresCustomer, orderController.create);

/*
 * PUT
 */
router.put('/:id', orderController.update);

/*
 * DELETE
 */
router.delete('/:id', orderController.remove);

module.exports = router;
