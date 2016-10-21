var User = require('./userModel');

exports.login = function(req, res) {
  User.findOne({username: req.body.username})
    .then(function(user) {
      // TODO: WHAT HAPPENS IF USER DOESN'T EXIST
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
          res.status(201).send(user);
        });
      } else {
        res.status(401).send();
      }
    });
};