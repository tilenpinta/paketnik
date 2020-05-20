const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const tokenSchema = new Schema({
	'base64String' : String,
	'created' : Date,
	'courierId': String,
	'orderId' : String,
	'crap' : String
});

module.exports = mongoose.model('token', tokenSchema);
