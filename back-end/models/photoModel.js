const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'views' : Number,
	'likes' : Number,
	'ownerId': String
});

/**
 * Če slika uporabnika obstaja, vrnemo true
 * To pomeni, da bomo samo update naredili
 *
 * @param reqId id uproabnika, ki želi dodat sliko
 *
 */
photoSchema.statics.alreadyExists = (reqId, callback) => {
	photo.findOne({ownerId: reqId})
		.exec((err, photo) => {
			if (err) {
				return callback(err);
			} else if (!photo) {
				let err = new Error('Not found');
				err.status = 401;
				return callback(err);
			} else if (photo){
				return callback(null, photo);
			}

		});
}




const photo = mongoose.model('photo', photoSchema);

module.exports = photo;
