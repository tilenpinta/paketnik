const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const deliverySchema = new Schema({
	'courierId' : String,  // id nasega kurira, ki bo paket dostavljal
	'packageOwnerId' : String, // id nasega
	'items' : Array, // polje znotraj katerega bodo hranjeni id-ji od vseh itemov, ki bi naj prisli k uporabniku
	'done' : Boolean, // ob oddaji narocila se nastavi na false
});

module.exports = mongoose.model('delivery', deliverySchema);
