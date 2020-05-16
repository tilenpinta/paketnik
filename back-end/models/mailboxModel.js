var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var mailboxSchema = new Schema({
	'registrationId' : String,
	'unlockKey' : String
});
module.exports = mongoose.model('mailbox', mailboxSchema);
