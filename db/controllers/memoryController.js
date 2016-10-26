var Memory = require('../models/memoryModel');
var User = require('../models/userModel');
var awsClient = require('../../server/aws');
var fs = require('fs');
var clarifai = require('../../api/clarifai');

exports.upload = function(req, res) {
  console.log('POST: /api/memories/upload');
  // console.log('req.file is now', req.file);
  awsClient.upload('uploads/' + req.file.filename, {}, function(err, versions, meta) {
		if (err) { 
			console.log('s3 upload error: ', err); 
		} 

		versions.forEach(function(image) {
			if (image.original) {
				Memory.create({
					title: req.file.filename,
					filePath: image.url, 
					createdAt: Date.now()
				}).then(function(memory) {
					fs.unlink('uploads/' + req.file.filename, function(err, success) {
						if (err) {
							console.log('Error deleting file,', err);
						}
					});

					clarifai(image.url).then(function(tags) {
						results = {
							api: 'clarifai',
							tags: tags
						};
						
						memory.analyses.push(JSON.stringify(results));
						memory.save();
					});

					User.findOne({username: req.user.username}).then(function(user) {
						user.memories.push(memory._id);		
						user.save(function(err) {
  						res.status(201).send(memory._id);
						});
					});
				}).catch(function(err) {
					console.log('Error creating memory,', err);
					res.status(404).send();
				});
			}
		});
	});

};

exports.fetchMemories = function(req, res) {

};

exports.fetchOne = function(req, res) {

};

var addOne = function(req, res) {

};