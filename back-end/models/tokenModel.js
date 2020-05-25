const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const tokenSchema = new Schema({
	'created' : Date,
	'courierId': String,
	'orderId' : String,
	'path' : String
});

module.exports = mongoose.model('token', tokenSchema);
