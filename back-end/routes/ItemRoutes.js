var express = require('express');
var router = express.Router();
var ItemController = require('../controllers/ItemController.js');

/*
 * GET
 */
router.get('/', ItemController.list);

/*
 * GET
 */
router.get('/:id', ItemController.show);

/*
 * POST
 */
router.post('/', ItemController.create);

/*
 * PUT
 */
router.put('/:id', ItemController.update);

/*
 * DELETE
 */
router.delete('/:id', ItemController.remove);

module.exports = router;
