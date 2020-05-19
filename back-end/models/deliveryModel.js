const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const deliverySchema = new Schema({
	'courierId' : String,  // id nasega kurira, ki bo paket dostavljal
	'packageOwnerId' : String, // id nasega
	'items' : Array, // polje znotraj katerega bodo hranjeni id-ji od vseh itemov, ki bi naj prisli k uporabniku
	'unlocked' : Boolean // na zacetku je zaklenjeno (torej false). odklene se ko uporabnik dovoli
});

module.exports = mongoose.model('delivery', deliverySchema);
