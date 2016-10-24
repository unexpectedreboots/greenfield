var memoryController = require('../../db/controllers/memoryController');

var express = require('express');

var router = express.Router();


// User uploads an image to create a memory
router.route('/upload')
  .post(memoryController.upload);

// User clicks button to view all memories
router.route('/all')
  .get(memoryController.fetchMemories);

// User clicks on specific memory to view details
router.route('/id/:id')
  .get(memoryController.fetchOne);

module.exports = router;