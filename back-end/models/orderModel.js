const  mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const orderSchema = new Schema({
	'customerId' : String,   // id uporabnika, ki je opravil narocilo
	'orderDate' : Date, // cas narocila
	'isDelivered' : Boolean, // privzeto false, po uspesni dostavi se nastavi na true
	'items' : Array // artikli, ki jih je uporabnik narocil
});

module.exports = mongoose.model('order', orderSchema);
