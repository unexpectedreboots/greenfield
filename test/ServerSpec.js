var expect = require('chai').expect;
var request = require('request');

var User = require('../db/models/userModel');

describe('Unprotected routes: ', function() {

  beforeEach(function(done) {
    User.remove({username: 'Phillip'}, function(err, something) {
      if (err) {
        console.log('err', err);
      }
      done();
    });
  });

  describe('User signup', function() {

    var signUpOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/users/signup',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };

    it('should return JWT in response body for successful signups', function(done) {
      request(signUpOptions, function(err, res, body) {
        if (err) {
          console.log('ERROR:', err);
        }
        expect(res.body.id_token).to.not.be.undefined;
        expect(res.statusCode).to.equal(201);
        done();
      });
    });

    it('should return empty response for duplicate usernames', function(done) {
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

    it('should insert new users into database', function(done) {
      request(signUpOptions, function(err, res, body) {
        if (err) {
          console.log('ERROR:', err);
        }
        User.findOne({username: 'Phillip'})
          .exec(function(err, user) {
            expect(user.username).to.equal('Phillip');
            expect(user.password).to.equal('Phillip'); // TODO change when encrypted
          });
        done();
      });
    });
  });

  describe('User login', function() {

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

    it('should return JWT with successful login', function(done) {
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

    it('should return empty response for nonexistent users', function(done) {
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

  describe('Memory creation', function() {

  });

  // TODO: write tests for routes

});