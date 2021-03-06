const orderModel = require('../models/orderModel.js');
const itemModel = require('../models/itemModel.js');
const userModel = require('../models/userModel.js');
const mailboxModel = require('../models/mailboxModel.js');
const tokenModel = require('../models/tokenModel.js');
const actualOrderModel = require('../models/actualOrderModel.js');

module.exports = {

    list: function (req, res) {
        itemModel.find({ customerId: req.session.userId }, (err, items) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting items.',
                    error: err
                });
            }
            res.render('order/place-order', { order: items });
        });
    },

    placeAnOrder: (req, res) => {
        userModel.findOne({ $and: [{ isOrdinaryUser: false }, { isAdmin: false }] }, (err, courier) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting items.',
                    error: err
                });
            } else {
                itemModel.find({ customerId: req.session.userId }, (err, orderedItems) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting items.',
                            error: err
                        });
                    } else if (orderedItems.length === 0) {
                        return res.status(404).render('naive-response', {text: 'Ni artiklov'});
                    } else {
                        let order = new orderModel({
                            customerId: req.session.userId,
                            courierId: courier._id,
                            orderDate: Date.now(),
                            isDelivered: false,
                            items: []
                        });

                        orderedItems.forEach(element => order.items.push(element));
                        order.save((err, order) => {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Napaka',
                                    error: err
                                });
                            } else {
                                const actualOrder = new actualOrderModel({
                                    items: [],
                                    orderId: order._id,
                                    customerId: req.session.userId
                                });
                                orderedItems.forEach(element => actualOrder.items.push(element));
                                actualOrder.save((err, order) => {
                                    if (err) {
                                        return res.status(500).json({
                                            message: 'Napaka.',
                                            error: err
                                        });
                                    }
                                    return res.status(200).render('naive-response', {text: 'Narocilo je uspesno oddano'});
                                });
                            }
                        });
                    }
                });
            }
        });
    },

    /**
     * orderController.update()
     */
    update: function (req, res) {
        const id = req.params.id;
        orderModel.findOne({ _id: id }, function (err, order) {
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
        const id = req.params.id;
        orderModel.findByIdAndRemove(id, function (err, order) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the order.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },
    showUndeliveredOrders: (req, res) => {
        orderModel.find({ courierId: req.session.userId }, (err, orders) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting items.',
                    error: err
                });
            } else if (orders) {
                const result = orders.filter(element => element.isDelivered == false);
                console.log("asd")

                res.render('order/undelivered-orders', { order: orders })
            } else {

                return res.status(404).json('Trenutno ni nedostavljenih narocil');
            }
        });

    },

    requireUnlock: (req, res) => {
        const key = req.params.id;
        const orderId = req.params.orderId;

        mailboxModel.findOne({ ownerId: key }, (err, mailbox) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            } else {
                if (mailbox.isLocked) {
                    mailbox.requireUnlock = true;
                    mailbox.orderId = orderId;

                    mailbox.courierId = req.session.userId;
                    mailbox.save(err => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when updating mailbox.',
                                error: err
                            });
                        }
                        return res.status(201).render('naive-response', {text: 'Zahteva za odklepanje je bila poslana'});
                    });
                } else {
                    orderModel.findOne({ _id: orderId }, (err, foundOrder) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting order.',
                                error: err
                            });
                        } else {
                            mailbox.isLocked = true;
                            mailbox.orderId = '';
                            mailbox.save(err => {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Error when updating mailbox.',
                                        error: err
                                    });
                                }

                                res.render('order/deliver-order', { order: foundOrder });
                            });

                        }
                    })
                }
            }
        })

    },

    showUnlock: (req, res) => {
        const orderId = req.params.orderId;
        tokenModel.find({ orderId: orderId }, (err, tokens) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting mailbox.',
                    error: err
                });
            } else if (!tokens) {
                return res.status(404).json({
                    message: 'No such tokens'
                });
            } else {
                let sorted = tokens.sort((a, b) => a.created - b.created);
                const path = sorted[sorted.length - 1].path;
                const fileName = path.substring(8, path.length) + '/token.wav';
                //console.log('filename' + fileName);
                res.render('order/play-token', { fileSource: fileName, currentOrderId: orderId });
            }

            //  res.json('odklenje');
        });
    },

    finishDelivery: (req, res) => {
        const orderId = req.params.currentOrderId;

        orderModel.findOne({ _id: orderId }, (err, order) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting order',
                    error: err
                });
            } else if (!order) {
                return res.status(404).json({
                    message: 'No such order'
                });
            } else {
                actualOrderModel.findOne({ orderId: orderId }, (err, actualOrder) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when getting order',
                            error: err
                        });
                    } else if (!actualOrder) {
                        return res.status(500).render('naive-response', {text: 'Napaka'});

                    } else {

                        let orderArray = order.items;
                        let actualArray = actualOrder.items;
                        let barcodes = [];
                        actualArray.forEach(element => barcodes.push(element.barcode));
                        sorted = orderArray.sort((a, b) => {
                            const key = 'barcode';
                            let A = a[key], B = b[key];
                            if (barcodes.indexOf(A) > barcodes.indexOf(B)) {
                                return 1;
                            } else {
                                return -1;
                            }
                        });

                        if ((sorted == null || actualArray == null) || (sorted.length != actualArray.length)) {
                            return res.status(404).render('naive-response', {text: 'Izdelki se ne ujemajo'});
                        }

                        else {
                            for (let i = 0; i < sorted.length; ++i) {
                                if (sorted[i].barcode !== actualArray[i].barcode || sorted[i].quantity != actualArray[i].quantity || sorted[i].weight != actualArray[i].weight) {
                                    return res.status(404).render('naive-response', {text: 'Izdelki se ne ujemajo'});
                                }
                            }
                            order.isDelivered = true;
                            order.save((err, order) => {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Napaka',
                                        error: err
                                    });
                                } else {
                                    return res.status(200).render('naive-response', {text: 'Dostava je opravljena'});
                                }
                            });
                        }
                    }
                });
            }
        });
    },
};