

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const itemSchema = new Schema({
	'name' : String,
	'weight' : Number,
	'quantity' : Number,
	'barcode' : String,
	'customerId': String
});

itemSchema.statics.generateBarcode = () => {
	let barcode = '';
	for (let i = 0; i < 12; i++ ) {
		barcode += (Math.floor(Math.random() * 10)).toString();
	}

	let sumEven = 0;
	let sumOdd = 0;
	let num = 0;
	let sum = 0;
	let lastDig;

	for(let i = 0; i < 12; i++) {
		num = parseInt(barcode.charAt(i));
		if(i%2 === 1) {
			sumEven = (num*3) + sumEven;
		}
		else {
			sumOdd += num;
		}
	}
	sum = sumEven + sumOdd;

	lastDig = 10 - (sum % 10);

	if(lastDig === 10) {
		lastDig = 0;
	}

	const newBarcode = barcode + lastDig.toString();

	return newBarcode;
}

const Item = mongoose.model('Item', itemSchema);


module.exports = Item;
