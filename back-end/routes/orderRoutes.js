const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

function requiresCustomer (req, res, next) {
    if (req.session && req.session.userId && req.session.isOrdinaryUser)  {
        return next();
    } else {
        let err = new Error('Dostop ni dovoljen! Prijavite se kot uporabnik');
        err.status = 401;
        return next(err);
    }
}

function requiresCourier (req, res, next) {
    if (req.session && req.session.userId && !req.session.isOrdinaryUser)  {
        return next();
    } else {
        let err = new Error('Dostop ni dovoljen!');
        err.status = 401;
        return next(err);
    }
}

router.get('/checkForUndeliveredOrders', requiresCourier, orderController.showUndeliveredOrders);
router.get('/placeOrder', requiresCustomer, orderController.list);

/*
 * POST
 */

router.post('/deliver/:currentOrderId', requiresCourier, orderController.finishDelivery);
router.post('/placeOrder', requiresCustomer, orderController.placeAnOrder);
router.post('/requireUnlock/:id/:orderId', requiresCourier, orderController.requireUnlock);
router.post('/requireUnlock/:id/unlockWithToken/:orderId', requiresCourier, orderController.showUnlock);

/*
 * PUT
 */
router.put('/:id', orderController.update);

/*
 * DELETE
 */
router.delete('/:id', orderController.remove);

module.exports = router;
