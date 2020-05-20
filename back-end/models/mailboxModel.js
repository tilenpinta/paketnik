const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const mailboxSchema = new Schema({
	'registrationId' : String,
	'unlockKey' : String,
	'ownerId' : String,
	'courierId' : String,
	'requireUnlock' : Boolean, // ko vpise id paketnika (000541), dostavljalec to nastavi na true
	'isLocked': Boolean, // to je privzeto na true, lahko pa uporabnik spreminja
});

/**
 * Preveri,če paket obstaja s takšno registracijsko številko
 *
 *
 * @param regId registracijska številka za registracijo paketnika, ki jo poda prijavljeni uporabnik
 * @param callback v primeru, da so pogoji izpolnjeni, vrne nam paketnik za registracijo
 */
mailboxSchema.statics.validation = (regId, callback) => {
//	console.log("From foo:" +regId);
	Mailbox.findOne({ registrationId: regId })
		.exec(function (err, mailbox) {
			if (err) {
				return callback(err)
			} else if (!mailbox) {
				let err = new Error('Mailbox not found.');
				err.status = 401;
				return callback(err);
			} else if(mailbox.ownerId.length > 0){
				let err = new Error('Paketnik ze ima lastnika');
				err.status = 401;
				return callback(err);
			} else {
				return callback(null, mailbox);
			}
		});
}

const Mailbox = mongoose.model('Mailbox', mailboxSchema);

module.exports = Mailbox;
