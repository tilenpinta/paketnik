var express = require('express');
var router = express.Router();
var mailboxController = require('../controllers/mailboxController.js');

/*
 * GET
 */
router.get('/',mailboxController.list);

/*
 * GET
 */
router.get('/register', mailboxController.showRegistration);
router.get('/token', mailboxController.showInsertToken)

router.get('/:id', mailboxController.show);

/*
 * POST
 */
//router.post('/', mailboxController.create);
router.post('/register', mailboxController.register);
router.post('/token', mailboxController.getToken)

/*
 * PUT
 */
router.put('/:id', mailboxController.update);

/*
 * DELETE
 */
router.delete('/:id', mailboxController.remove);

module.exports = router;

/*
const formData = {
  // Pass a simple key-value pair
  my_field: 'my_value',
  // Pass data via Buffers
  my_buffer: Buffer.from([1, 2, 3]),
  // Pass data via Streams
  my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
  // Pass multiple values /w an Array
  attachments: [
    fs.createReadStream(__dirname + '/attachment1.jpg'),
    fs.createReadStream(__dirname + '/attachment2.jpg')
  ],
  // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
  // Use case: for some types of streams, you'll need to provide "file"-related information manually.
  // See the `form-data` README for more information about options: https://github.com/form-data/form-data
  custom_file: {
    value:  fs.createReadStream('/dev/urandom'),
    options: {
      filename: 'topsecret.jpg',
      contentType: 'image/jpeg'
    }
  }
};*/

