const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
	'email' : String,
	'username' : String,
	'password' : String,
    'items' : Array,
    'isOrdinaryUser': Boolean,
    'isAdmin' : Boolean
});


/**
 * Preverimo če uporabnik ima administratorske pravice
 */

/**
 * Avtentikacija ob prijavi uporabnika
 *
 * @param username poišče uporabnika v PB po tem uporabniškem imenu
 * @param password preveri če se hash vrednost tega vnosa ujema z vrednostjo v PB
 * @param callback vrne nam uporabnika v primeru, da je avtentikacija bila uspešna
 */
userSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        let err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

/**
 *  Preveri če uporabnik že obstaja v PB po uporabniškem imenu
 *  ali po e-naslovu
 *
 * @param username poišče uporabnika v PB po tem uporabniškem imenu
 * @param email poišče uporabnika v PB po tem e-naslovu
 */
userSchema.statics.checkUser = (username, email, callback) =>{
    User.findOne({$or: [{email: email},{username: username}]})
        .exec( (err, user) => {
            if (err) {
                return callback(err);
            } else if(!user){
                let err = new Error('Not found');
                err.status = 401;
                return callback(err);
            } else if(user){
                callback(null, user);
            }
        });
}

/**
 * Naredi hash vrednost za geslo, ki ga je uporabnik vnesel
 */
userSchema.pre('save', function (next) {
  let user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', userSchema);
module.exports = User;
