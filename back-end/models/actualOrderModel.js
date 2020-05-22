const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const actualOrderSchema = new Schema({
	'items' : Array,
	'orderId' : String,
	'customerId' : String
});

module.exports = mongoose.model('actualOrder', actualOrderSchema);
