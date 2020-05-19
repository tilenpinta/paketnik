const userModel = require('../models/userModel.js');
const bcrypt = require('bcrypt');
/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {

    /**
     * userController.list()
     */
    list: function (req, res) {
        userModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        const id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user.',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }
            return res.json(user);
        });
    },

    create: (req, res) => {
        const userReq = new userModel({
			email : req.body.email,
			username : req.body.username,
			password : req.body.password,
            isOrdinaryUser: true,
            isAdmin: false

        });
        userModel.checkUser(userReq.username, userReq.email, (err, user) =>{
           if(user){
               return res.status(409).json("Uporabnik s tem e-naslovom ali uporabniskim imenom ze obstaja");
           }
           else if(!user){
               userReq.save( err => {
                   if (err) {
                       return res.status(500).json({
                           message: 'Error when creating user',
                           error: err
                       });
                   }
                   return res.status(201).json(userReq);
               });
           }
           else {
               return res.json("Fuck");
           }
        });

    },
    /**
     * userController.login()
     */
    showLogin: function (req, res) {
         res.render('user/login');
    }
    ,
    showRegister: function (req, res) {
        res.render('user/register');
    }
    ,
    login: function (req, res,next) {
      userModel.authenticate(req.body.username, req.body.password, function (error, user) {
          if (!(error || !user)) {
              req.session.userId = user._id;
              req.session.userAdmin = user.isAdmin;
              req.session.isOrdinaryUser = user.isOrdinaryUser;
              return res.status(201).json(user);
          } else {
              let err = new Error('Wrong username or password.');
              err.status = 401;
              return next(err);
          }
      })
    },
    /**
     * userController.login()
     */

    logout: function (req, res,next) {
        console.log("Iz logut: " + req.session.userId);
   if (req.session)  {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.status(200);
      }
    });
    }
  },
        /**
     * userController.profil()
     */

    profile: function (req, res,next) {
      userModel.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          let err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          res.render('user/profile', user);
        }
      }
    });
  },
    /**
     * userController.update()
     */
    update: function (req, res) {
        const id = req.params.id;
        userModel.findOne({_id: id}, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }

            user.email = req.body.email ? req.body.email : user.email;
			user.username = req.body.username ? req.body.username : user.username;
			user.password = req.body.password ? req.body.password : user.password;
			user.isAdmin = false;
            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating user.',
                        error: err
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        const id = req.params.id;
        userModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    showAdminCreate: (req, res) => {
        res.render('user/admin-create');
    },
    showAdminDelete: (req, res) => {
        res.render('user/admin-delete');
    },
    showAdminUpdate: (req, res) => {
        res.render('user/admin-update');
    },

    adminCreate: (req, res) => {
        console.log(req.body.racun);
        let ordinaryUser = true;

        if(req.body.racun.toString() !== 'uporabnik'){
            ordinaryUser = false;
        }

        const userReq = new userModel({
            email : req.body.email,
            username : req.body.username,
            password : req.body.password,
            isOrdinaryUser: ordinaryUser,
            isAdmin: false

        });
        userModel.checkUser(userReq.username, userReq.email, (err, user) =>{
            if(user){
                return res.status(409).json("Uporabnik s tem e-naslovom ali uporabniskim imenom ze obstaja");
            }
            else if(!user){
                userReq.save( err => {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating user',
                            error: err
                        });
                    }
                    return res.status(201).json(userReq);
                });
            }
            else {
                return res.redirect('../../users/admin-create');
            }
        });
    },

    adminDelete: (req, res) => {
        const id = req.body.user_id;
        userModel.deleteOne({_id: id}, err => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the user.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    },

    adminUpdate: (req, res) => {
        const id = req.body.user_id;
        console.log("Id od update uproabnika: " + id);

        let ordinaryUser = true;

        if(req.body.racun.toString() !== 'uporabnik'){
            ordinaryUser = false;
        }

        const setValues = {
            $set: {
                email: req.body.email, username: req.body.username,
                isOrdinaryUser: ordinaryUser, isAdmin: false
            }
        };
        const myquery = {_id: id};

        userModel.updateOne(myquery, setValues, (err, user) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting user',
                    error: err
                });
            }
            if (!user) {
                return res.status(404).json({
                    message: 'No such user'
                });
            }else{
                return res.status(201).json(user);
            }
        });
    }

};