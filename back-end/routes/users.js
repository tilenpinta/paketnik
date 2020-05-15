const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('To je naš uporabnik');
});

module.exports = router;
