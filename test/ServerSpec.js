var expect = require('chai').expect;
var request = require('request');

var User = require('../db/models/userModel');

describe('', function() {

  // beforeEach(function(done) {
  //   console.log('BEFORE');
  //   User.remove({username: 'Phillip'}, function(err) {
  //     if (err) {
  //       console.log(err);
  //     }
  //   });
  //   done();
  // });

  describe('User creation', function() {

    beforeEach(function(done) {
      console.log('BEFORE');
      User.remove({username: 'Phillip'}, function(err) {
        if (err) {
          console.log(err);
        }
      });
      done();
    });

    var signUpOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/users/signup',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };

    it('Should return user info in response body for successful signups', function(done) {
      request(signUpOptions, function(err, res, body) {
        if (err) {
          console.log('ERROR:', err);
        }
        expect(res.body.id_token).to.not.be.undefined;
        expect(res.statusCode).to.equal(201);
        done();
      });
    });

    it('Should not add duplicate username to the database', function(done) {
      request(signUpOptions, function(err, res, body) {
        request(signUpOptions, function(err, res, body) {
          if (err) {
            console.log('ERROR:', err);
          }
          expect(res.body).to.be.undefined;
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });
  });

  describe('User log in', function() {

    // beforeEach(function(done) {
    //   console.log('BEFORE');
    //   User.remove({username: 'Phillip'}, function(err) {
    //     if (err) {
    //       console.log(err);
    //     }
    //   });
    //   done();
    // });

    var signUpOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/users/signup',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };
    var loginOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/users/login',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };

    it('Should log in an existing user to the database', function(done) {
      User.remove({username: 'Phillip'}, function(err) {
        request(signUpOptions, function(err, res, body) {
          request(loginOptions, function(err, res, body) {
            if (err) {
              console.log('ERROR:', err);
            }
            expect(res.body.id_token).to.not.be.undefined;
            expect(res.statusCode).to.equal(201);
            done();
          });
        });
      });
    });

    it('Should not log in a user that does not exist', function(done) {
      User.remove({username: 'Phillip'}, function(err) {
        request(loginOptions, function(err, res, body) {
          if (err) {
            console.log('ERROR:', err);
          }
          expect(res.body).to.be.undefined;
          expect(res.statusCode).to.equal(401);
          done();
        });
      });
    });

  });

  describe('Memory creation', function() {

  });

  // TODO: write tests for routes

});