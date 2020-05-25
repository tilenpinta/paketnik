const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photoController.js');

const multer = require('multer');
const upload = multer({ dest: 'public/images/' });


function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    const err = new Error('You must be logged in to view this page.');
    err.status = 401;
    return next(err);
  }
}

/*
 * GET
 */
router.get('/', photoController.list);
router.get('/dodaj',requiresLogin, photoController.dodaj);

router.get('/:id', photoController.show);

/*
 * POST
 */
 //post zahteva na naslov najprej shrani datoteko, ki je bila na naslov posredovana z imenom slika
//ta se shrani v mapo /public/slike, na voljo pa imamo req.file, kjer so vsi podatki o sliki
//poleg same slike pričakujemo tudi lastnost ime, ki nosi podatek o naslovu (imenu) slike 
router.post('/',requiresLogin,upload.single('slika'), photoController.create);

/*
 * PUT
 */
router.put('/:id', photoController.update);

/*
 * DELETE
 */
router.delete('/:id', photoController.remove);

module.exports = router;
