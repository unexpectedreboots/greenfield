var expect = require('chai').expect;
var clarifai = require('../api/clarifai');
var microsoft = require('../api/microsoft');

describe('api calls', function() {

	describe('clarifai should return tags', function() {

		it('has an item as the first tag', function(done) {
			clarifai('http://i0.kym-cdn.com/photos/images/facebook/000/011/296/success_baby.jpg')
			.then(function(tags){
				expect(tags[0]).to.be.a('string');
				done();
			})
			.catch(function(err) {
				expect(err).to.be.null;
				done();
			});

		});

	});

	describe('microsoft should return tags', function() {

		it('has an item as the first tag', function(done) {
			microsoft('http://i0.kym-cdn.com/photos/images/facebook/000/011/296/success_baby.jpg')
			.then(function(tags){
				expect(tags[0].name).to.be.a('string');
				done();
			})
			.catch(function(err) {
				expect(err).to.be.null;
				done();
			});

		});

	});

});