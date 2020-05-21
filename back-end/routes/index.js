const express = require('express');
const router = express.Router();

/**
 * Home page
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

Handlebars.registerHelper('activeTabIs', function(tab){
  return Session.equals('ActiveProfileTab',  tab);
});

module.exports = router;
