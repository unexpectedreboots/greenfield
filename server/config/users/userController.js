var User = require('./userModel');

exports.login = function(req, res) {

};

exports.signup = function(req, res) {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(function(user) {
    res.status(201).send(user);
  });
};