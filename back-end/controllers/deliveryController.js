var deliveryModel = require('../models/deliveryModel.js');

/**
 * deliveryController.js
 *
 * @description :: Server-side logic for managing deliverys.
 */
module.exports = {

    /**
     * deliveryController.list()
     */
    list: function (req, res) {
        deliveryModel.find(function (err, deliverys) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }
            return res.json(deliverys);
        });
    },

    /**
     * deliveryController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        deliveryModel.findOne({_id: id}, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery.',
                    error: err
                });
            }
            if (!delivery) {
                return res.status(404).json({
                    message: 'No such delivery'
                });
            }
            return res.json(delivery);
        });
    },

    /**
     * deliveryController.create()
     */
    create: function (req, res) {
        var delivery = new deliveryModel({
			courierId : req.body.courierId,
			packageOwnerId : req.body.packageOwnerId,
			items : req.body.items,
			unlocked : req.body.unlocked

        });

        delivery.save(function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating delivery',
                    error: err
                });
            }
            return res.status(201).json(delivery);
        });
    },

    /**
     * deliveryController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        deliveryModel.findOne({_id: id}, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting delivery',
                    error: err
                });
            }
            if (!delivery) {
                return res.status(404).json({
                    message: 'No such delivery'
                });
            }

            delivery.courierId = req.body.courierId ? req.body.courierId : delivery.courierId;
			delivery.packageOwnerId = req.body.packageOwnerId ? req.body.packageOwnerId : delivery.packageOwnerId;
			delivery.items = req.body.items ? req.body.items : delivery.items;
			delivery.unlocked = req.body.unlocked ? req.body.unlocked : delivery.unlocked;
			
            delivery.save(function (err, delivery) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating delivery.',
                        error: err
                    });
                }

                return res.json(delivery);
            });
        });
    },

    /**
     * deliveryController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        deliveryModel.findByIdAndRemove(id, function (err, delivery) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the delivery.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
