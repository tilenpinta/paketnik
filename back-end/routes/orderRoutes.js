const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController.js');

router.get('/placeOrder', orderController.list);

/*
 * GET
 */
router.get('/:id', orderController.show);

/*
 * POST
 */
router.post('/placeOrder', orderController.create);

/*
 * PUT
 */
router.put('/:id', orderController.update);

/*
 * DELETE
 */
router.delete('/:id', orderController.remove);

module.exports = router;
