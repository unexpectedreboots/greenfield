var userController = require('../../db/controllers/userController');

var express = require('express');

var router = express.Router();


// User log in
router.route('/login')
  .post(userController.login);

// New user sign up
router.route('/signup')
  .post(userController.signup);

 

module.exports = router;