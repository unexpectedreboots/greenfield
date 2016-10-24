var User = require('../models/userModel');

exports.login = function(req, res) {
  User.findOne({username: req.body.username})
    .then(function(user) {
      // TODO: WHAT HAPPENS IF USER DOESN'T EXIST
      // console.log('USER', user);
      if (!user) {
        res.status(401).send();
      }
      res.status(201).send(user);
    });
};

exports.signup = function(req, res) {
  User.findOne({username: req.body.username})
    .then(function(user) {
      if (!user) {
        User.create({
          username: req.body.username,
          password: req.body.password
        }).then(function(user) {
          // console.log('USER CREATED', user);
          res.status(201).send(user);
        });
      } else {
        res.status(401).send();
      }
    });
};