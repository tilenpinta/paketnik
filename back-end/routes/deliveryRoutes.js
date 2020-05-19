var express = require('express');
var router = express.Router();
var deliveryController = require('../controllers/deliveryController.js');

/*
 * GET
 */
router.get('/', deliveryController.list);

/*
 * GET
 */
router.get('/:id', deliveryController.show);

/*
 * POST
 */
router.post('/', deliveryController.create);

/*
 * PUT
 */
router.put('/:id', deliveryController.update);

/*
 * DELETE
 */
router.delete('/:id', deliveryController.remove);

module.exports = router;
