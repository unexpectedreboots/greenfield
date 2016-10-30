var expect = require('chai').expect;
var clarifai = require('../api/clarifai');
var microsoft = require('../api/microsoft');
var caption = require('../api/caption');

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

	describe('captioner should return caption', function() {
		it('thinks the successkid is on a beach and angry', function(done) {
			this.timeout(5000);
			caption('https://s3-us-west-1.amazonaws.com/invalidmemories/images/02c9dce5-e903-4396-82ea-66f5892a821e-large.jpg', 
				function(err, content) {
					expect(err).to.be.null;
					expect(content).to.equal('a little boy sitting on a beach\nand he seems 😠. ');
					done();
			});
		});
	});

});