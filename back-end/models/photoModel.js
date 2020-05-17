const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'views' : Number,
	'likes' : Number
});

module.exports = mongoose.model('photo', photoSchema);
