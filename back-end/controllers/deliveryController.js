const deliveryModel = require('../models/deliveryModel.js');

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
        const id = req.params.id;
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
        const delivery = new deliveryModel({
			courierId : req.body.courierId,
			packageOwnerId : req.body.packageOwnerId,
			items : req.body.items,
            done : false,
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
     * deliveryController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;
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
