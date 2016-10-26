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
    // var photo = {
    //   uri: '~/Desktop/screenshots/kyle9.png',
    //   type: 'image/png',
    //   name: 'testImage.png'
    // };
    // var form = new FormData();
    // form.append('memoryImage', photo);
    // var uploadOptions = {
    //   method: 'POST',
    //   url: 'http://localhost:3000/api/memories/upload',
    //   body: form,
    //   headers: {
    //         'Content-Type': 'multipart/form-data',
    //         'Authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ODBmYzdiMTZhYWE2ODM2OTk2NDc5MTQiLCJ1c2VybmFtZSI6Im5ldyIsInBhc3N3b3JkIjoidXNlciIsIl9fdiI6MCwibWVtb3JpZXMiOltdfQ.VfV0DtedVfOUZNAM6fOrMQCakF6Zrcbk-ujie0YGvd4'
    //   } 
    // };

    // // local: if works, should save a file to upload under that name (use fs.readfile?)
    // it ('should create a local file', function(done) {
    //   request(uploadOptions, function(err, res, body) {
    //     if (err) {
    //       console.log('ERROR creating local', err);
    //     }
    //     console.log('body is', body);
    //     done();
    //   });
    // });
    // if doesnt work, should 
    // aws: if works, should return the name of the was file? 
    // if doesnt work, should send back error message 
  });

  // TODO: write tests for routes

});