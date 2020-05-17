var ItemModel = require('../models/ItemModel.js');

/**
 * ItemController.js
 *
 * @description :: Server-side logic for managing Items.
 */
module.exports = {

    /**
     * ItemController.list()
     */
    list: function (req, res) {
        ItemModel.find(function (err, Items) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Item.',
                    error: err
                });
            }
            return res.json(Items);
        });
    },

    /**
     * ItemController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        ItemModel.findOne({_id: id}, function (err, Item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Item.',
                    error: err
                });
            }
            if (!Item) {
                return res.status(404).json({
                    message: 'No such Item'
                });
            }
            return res.json(Item);
        });
    },

    /**
     * ItemController.create()
     */
    create: function (req, res) {
        var Item = new ItemModel({
			name  : req.body.name ,
			weight  : req.body.weight ,
			barcode : req.body.barcode

        });

        Item.save(function (err, Item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Item',
                    error: err
                });
            }
            return res.status(201).json(Item);
        });
    },

    /**
     * ItemController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        ItemModel.findOne({_id: id}, function (err, Item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Item',
                    error: err
                });
            }
            if (!Item) {
                return res.status(404).json({
                    message: 'No such Item'
                });
            }

            Item.name  = req.body.name  ? req.body.name  : Item.name ;
			Item.weight  = req.body.weight  ? req.body.weight  : Item.weight ;
			Item.barcode = req.body.barcode ? req.body.barcode : Item.barcode;
			
            Item.save(function (err, Item) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating Item.',
                        error: err
                    });
                }

                return res.json(Item);
            });
        });
    },

    /**
     * ItemController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        ItemModel.findByIdAndRemove(id, function (err, Item) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the Item.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
