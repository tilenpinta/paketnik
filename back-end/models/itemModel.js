

const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const itemSchema = new Schema({
	'name' : String,
	'weight' : Number,
	'quantity' : Number,
	'barcode' : String,
	'customerId': String
});

const toInt = function( numString ) {
	return parseInt( numString, 10 );
};
const isOdd = function( num ) {
	return (num % 2) === 1;
}

itemSchema.statics.generateBarcode = () => {
	let barcode = '';
	for (let i = 0; i < 12; i++ ) {
		barcode += (Math.floor(Math.random() * 10)).toString();
		console.log(barcode);
	}

	console.log("\n");

	let sumEven = 0;
	let sumOdd = 0;
	let num = 0;

	for(let i = 0; i < 11; i++) {
		num = parseInt(barcode);
	}
	console.log(num);
}

/*
itemSchema.statics.generateBarcode = () => {
	let barcode = '';
	for (let i = 0; i < 13; i++ ) {
		barcode += (Math.floor(Math.random() * 10)).toString();
		console.log("barcode");
		console.log(barcode);
		console.log();
	}


	gtin = parseInt( barcode, 10 ).toString();
	console.log(gtin);
	let chunks = gtin.split('').map( toInt ).reverse();
	console.log("\n" + chunks);
	let checksum = 0;

	// Remove first chuck (checksum)
	chunks.shift();

	console.log("\n" + chunks + "\n");

	// sum numbers and multiply accordingly
	chunks.forEach( (number, index) => {
		checksum += isOdd(index) ? number : number*3;
		console.log(checksum);
	});
	// calc checksum
	checksum %= 10;
	checksum = (checksum === 0) ? 0 : (10 - checksum);
	const newBarcode = barcode + checksum.toString();
	return newBarcode;
}
*/

const Item = mongoose.model('Item', itemSchema);


module.exports = Item;
