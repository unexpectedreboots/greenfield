var expect = require('chai').expect;
var request = require('request');

var User = require('../server/config/users/userModel');

describe('', function() {

  beforeEach(function(done) {
    User.remove({username: 'Phillip'}).exec();
    done();
  });

  describe('User creation', function() {
    var signUpOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/signup',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };

    it('Should add a new user to the database', function(done) {
      request(signUpOptions, function(err, res, body) {
        if (err) {
          console.log('ERROR:', err);
        }
        expect(res.body.username).to.equal('Phillip');
        expect(res.body.password).to.not.be.null;
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
    var signUpOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/signup',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };
    var loginOptions = {
      method: 'POST',
      url: 'http://localhost:3000/api/login',
      json: {
        username: 'Phillip',
        password: 'Phillip'
      }
    };

    it('Should log in an existing user to the database', function(done) {
      request(signUpOptions, function(err, res, body) {
        request(loginOptions, function(err, res, body) {
          if (err) {
            console.log('ERROR:', err);
          }
          expect(res.body.username).to.equal('Phillip');
          expect(res.body.password).to.not.be.null;
          expect(res.statusCode).to.equal(201);
          done();
        });
      });
    });

    it('Should not log in a user that does not exist', function(done) {
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