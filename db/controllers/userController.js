var User = require('../models/userModel');

var jwt = require('jsonwebtoken');
var _ = require('lodash');

var createToken = function(user) {
  return jwt.sign(_.omit(user, 'password'), 'config.secret', { expiresIn: 60 * 60 * 5 });
};

// Error messages to log and return as responses
var errNoUsername = 'Username does not exist'; 
var errIncorrectPassword = 'Incorrect password';
var errUsernameTaken = 'Username already taken';

exports.login = function(req, res) {
  console.log('POST /api/users/login. username:', req.body.username);
  User.findOne({username: req.body.username})
    .then(function(user) {
      if (!user) {
        console.log(errNoUsername);
        res.status(401).send(errNoUsername);
      } else if (user.password !== req.body.password) {
        console.log(errIncorrectPassword);
        res.status(401).send(errIncorrectPassword);
      }

      res.status(201).send({
        'id_token': createToken(user)
      });
    });
};

exports.signup = function(req, res) {
  console.log('POST /api/users/signup. username:', req.body.username);
  User.findOne({username: req.body.username})
    .then(function(user) {
      if (!user) {
        User.create({
          username: req.body.username,
          password: req.body.password
        }).then(function(user) {
          res.status(201).send({
            'id_token': createToken(user)
          });
        });
      } else {
        console.log(errUsernameTaken);
        res.status(401).send(errUsernameTaken);
      }
    });
};