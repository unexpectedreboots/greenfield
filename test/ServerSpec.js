var expect = require('chai').expect;
var request = require('request');


describe('', function() {

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
        done();
      });
    });
  });

  describe('Memory creation', function() {

  });

});