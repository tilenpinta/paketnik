var photoModel = require('../models/photoModel.js');

/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        photoModel.find(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            return res.json(photos);
           // return res.render('photo/list',photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        photoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }
            return res.json(photo);
        });
    },

    /**
     * photoController.create()
     */
    dodaj: function (req, res) {

         res.render('photo/dodaj');
    },
    /**
     * Ce uporabnik ze ima sliko, ta funkcija samo zamenja z novo (ime slike in pot)
     * V nasportnem primeru pa doda sliko
     *
     */
    create: function (req, res) {
        const id = req.session.userId;
        photoModel.alreadyExists(id,(error, image) =>{
           // if(error){
             //   let err = new Error("Id" + id);
               // err.status = 401;
                //return next(err);
            //}
             if(!image){
                const photo = new photoModel({
                    name: req.body.name,
                    path: 'images/' + req.file.filename,
                    views: req.body.views,
                    likes: req.body.likes,
                    ownerId: req.session.userId
                });

                photo.save(function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating photo',
                            error: err
                        });
                    }
                    return res.status(201).json(photo);
                });
            }
            else if(image){
                const newPath = 'images/' + req.file.filename;
                image.name = req.body.name ? req.body.name : image.name;
                image.path = req.body.path ? newPath : image.path;
                image.views = req.body.views ? req.body.views : image.views;
                image.likes = req.body.likes ? req.body.likes : image.likes;

                image.save(function (err, image) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when updating photo.',
                            error: err
                        });
                    }

                    return res.json(image);
                });
            }
            else {
                return res.json('Nepricakovana napaka');
            }

        });
    },


    /**
     * photoController.update()
     */
    update: function (req, res) {
        const id = req.params.id;
        photoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        photoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};