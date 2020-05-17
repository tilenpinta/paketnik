const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const ItemSchema = new Schema({
	'name ' : String,
	'weight ' : Number,
	'barcode' : String
});

module.exports = mongoose.model('Item', ItemSchema);
