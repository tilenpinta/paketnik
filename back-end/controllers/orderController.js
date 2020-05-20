const orderModel = require('../models/orderModel.js');
const itemModel = require('../models/itemModel.js');
/**
 * orderController.js
 *
 * @description :: Server-side logic for managing orders.
 */
module.exports = {

    /**
     * orderController.list()
     */
    list: function (req, res) {
        itemModel.find( {customerId: req.session.userId }, (err, items) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting items.',
                    error: err
                });
            }
            res.render('order/place-order', { order : items } );
        });
    },

    /**
     * orderController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order.',
                    error: err
                });
            }
            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }
            return res.json(order);
        });
    },

    /**
     * orderController.create()
     */
    create: function (req, res) {
        let order = new orderModel({
			customerId : req.session.userId,
			orderDate : Date.now(),
			isDelivered : false,
			items : []

        });

        itemModel.find( {customerId: req.session.userId }, (err, orderedItems) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting items.',
                    error: err
                });
            }
            if(orderedItems.length === 0){
                return res.status(404).json({
                   message: 'Items not found',
                });
            }
            orderedItems.forEach( element => order.items.push(element._id) );
        });

        order.save(function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating order',
                    error: err
                });
            }
            return res.status(201).json(order);
        });
    },

    /**
     * orderController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        orderModel.findOne({_id: id}, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order',
                    error: err
                });
            }
            if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            }

            order.customerId = req.body.customerId ? req.body.customerId : order.customerId;
			order.orderDate = req.body.orderDate ? req.body.orderDate : order.orderDate;
			order.isDelivered = req.body.isDelivered ? req.body.isDelivered : order.isDelivered;
			order.items = req.body.items ? req.body.items : order.items;
			
            order.save(function (err, order) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating order.',
                        error: err
                    });
                }

                return res.json(order);
            });
        });
    },

    /**
     * orderController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        orderModel.findByIdAndRemove(id, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the order.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
