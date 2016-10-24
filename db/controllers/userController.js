var User = require('../models/userModel');

var jwt = require('jsonwebtoken');
var _ = require('lodash');

var createToken = function(user) {
  return jwt.sign(_.omit(user, 'password'), 'config.secret', { expiresIn: 60 * 60 * 5 });
};

exports.login = function(req, res) {
  console.log('POST: /api/users/login');
  User.findOne({username: req.body.username})
    .then(function(user) {
      if (!user) {
        res.status(401).send();
      }
      res.status(201).send({
        'id_token': createToken(user)
      });
    });
};

exports.signup = function(req, res) {
  console.log('POST: /api/users/signup');
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
        res.status(401).send();
      }
    });
};