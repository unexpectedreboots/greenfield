var memoryController = require('../../db/controllers/memoryController');
var express = require('express');
var jwt = require('express-jwt');
var multer = require('multer');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // console.log('the original file name is', file);
    cb(null, file.originalname);
  }
});

var upload = multer({ storage: storage });

var router = express.Router();


var jwtCheck = jwt({
  // TODO: change this secret to be stored in config file
  secret: 'config.secret'
});

router.use('/', jwtCheck);

// User uploads an image to create a memory
router.route('/upload').post(upload.single('memoryImage'), memoryController.upload);

// User clicks button to view all memories
router.route('/all').get(memoryController.fetchMemories);

// User clicks on specific memory to view details
router.route('/id/:id').get(memoryController.fetchOne);

router.route('/id/:id').post(jsonParser, memoryController.storeTags);

//User searches for a specific tag
router.route('/search/:query').get(memoryController.searchMemories);

module.exports = router;