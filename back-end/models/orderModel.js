const  mongoose = require('mongoose');
const Schema   = mongoose.Schema;



function mapOrder(array, order, key) {

    array.sort(function (a, b) {
        let A = a[key], B = b[key];

        if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
        } else {
            return -1;
        }

    });

    return array;
};

function arraysEqual(a, b) {
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    for (let i = 0; i < a.length; ++i) {
        //console.log('A:' + a[i].barcode + 'and' + ' B ' + b[i].barcode);
        if (a[i].barcode !== b[i].barcode || a[i].quantity != b[i].quantity || a[i].weight != b[i].weight) return false;
    }
    return true;
}

const orderSchema = new Schema({
	'customerId' : String,   // id uporabnika, ki je opravil narocilo
	'courierId' : String,
 	'orderDate' : Date, // cas narocila
	'isDelivered' : Boolean, // privzeto false, po uspesni dostavi se nastavi na true
	'items' : Array // artikli, ki jih je uporabnik narocil
});

// TODO
orderSchema.statics.isActualOrder = (a, b, callback) => {
	let orderArray = a.items;
	let actualArray = b.items;
	let barcodes = [];
    actualArray.forEach(element => barcodes.push(element.barcode)); 
	sorted = mapOrder(orderArray, barcodes, 'barcode')
	if(arraysEqual){
		return callback(null, true)
	} else {
		let err = new Error('Izdelki se ne ujemajo.');
        err.status = 401;
        return callback(err, false);
	}
}

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;