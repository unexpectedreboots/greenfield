var memoryController = require('../../db/controllers/memoryController');

var express = require('express');
var jwt = require('express-jwt');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});

var router = express.Router();


var jwtCheck = jwt({
  // TODO: change this secret to be stored in config file
  secret: 'config.secret'
});

router.use('/', jwtCheck);

// User uploads an image to create a memory
router.route('/upload')
  .post(upload.single('memoryImage'), memoryController.upload);

// User clicks button to view all memories
router.route('/all')
  .get(memoryController.fetchMemories);

// User clicks on specific memory to view details
router.route('/id/:id')
  .get(memoryController.fetchOne);

module.exports = router;