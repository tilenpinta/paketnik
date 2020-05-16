var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'email' : String,
	'username' : String,
	'password' : String
});


/*
*     userModel.findOne({$or: [{email: userReq.email},{username: userReq.username}]}, function (err, user) {
            if (err || user) {
                return false;
            }
        });
* */
//authenticate input against database
userSchema.statics.authenticate = function (username, password, callback) {
  User.findOne({ username: username })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
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
 *  Funkcija preveri če uporabnik že obstaja po uporabniškem imenu
 *  ali po e-naslovu
 *
 * @param username uporabniško ime iz zahteve za registracijo (req.body.username)
 * @param email e-naslov iz zahteve za registracijo (req.body.email)
 */
userSchema.statics.checkUser = function (username, email) {
    User.findOne({$or: [{email: email},{username: username}]})
        .exec(function (err, user) {
            if (err) {
                return false;
            } else return !user;
        });
}

//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

var User = mongoose.model('User', userSchema);
module.exports = User;
