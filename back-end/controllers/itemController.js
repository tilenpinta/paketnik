const itemModel = require('../models/itemModel.js');

/**
 * itemController.js
 *
 * @description :: Server-side logic for managing items.
 */
module.exports = {

    /**
     * itemController.list()
     */
    list: function (req, res) {
        itemModel.find(function (err, items) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting item.',
                    error: err
                });
            }
            return res.json(items);
        });
    },

    /**
     * itemController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        itemModel.findOne({_id: id}, function (err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting item.',
                    error: err
                });
            }
            if (!item) {
                return res.status(404).json({
                    message: 'No such item'
                });
            }
            return res.json(item);
        });
    },

    /**
     * itemController.create()
     */
    create: function (req, res) {
        const item = new itemModel({
			name : req.body.name,
			weight : req.body.weight,
			quantity : req.body.quantity,
			barcode : req.body.barcode

        });

        item.save( (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating item',
                    error: err
                });
            }
            return res.status(201).json(item);
        });
    },

    /**
     * itemController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        itemModel.findOne({_id: id}, function (err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting item',
                    error: err
                });
            }
            if (!item) {
                return res.status(404).json({
                    message: 'No such item'
                });
            }

            item.name = req.body.name ? req.body.name : item.name;
			item.weight = req.body.weight ? req.body.weight : item.weight;
			item.quantity = req.body.quantity ? req.body.quantity : item.quantity;
			item.barcode = req.body.barcode ? req.body.barcode : item.barcode;
			
            item.save(function (err, item) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating item.',
                        error: err
                    });
                }

                return res.json(item);
            });
        });
    },

    /**
     * itemController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        itemModel.findByIdAndRemove(id, function (err, item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the item.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    showAddItem: (req, res) => {
        res.render('item/add-item');
    },

    addItem: (req, res) => {
        const validBarcode = itemModel.generateBarcode();

        const item = new itemModel({
            name : req.body.name,
            weight : req.body.weight,
            quantity : req.body.quantity,
            barcode : validBarcode

        });

        item.save( (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating item',
                    error: err
                });
            }
            return res.status(201).json(item);
        });
    }

};
