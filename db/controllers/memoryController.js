var Memory = require('../models/memoryModel');
var awsClient = require('../../server/aws');

exports.upload = function(req, res) {
  console.log('POST: /api/memories/upload');
  // console.log('req.file is now', req.file);
  awsClient.upload('uploads/' + req.file.filename, {}, function(err, versions, meta) {
		if (err) { 
			console.log('s3 upload error: ', err); 
		} 

		versions.forEach(function(image) {
			console.log(image.width, image.height, image.url);
		});
	});

  res.status(201).send(req.file.filename);
};

exports.fetchMemories = function(req, res) {

};

exports.fetchOne = function(req, res) {

};

var addOne = function(req, res) {

};