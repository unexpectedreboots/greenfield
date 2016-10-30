var Memory = require('../models/memoryModel');
var User = require('../models/userModel');
var awsClient = require('../../server/aws');
var fs = require('fs');
var clarifai = require('../../api/clarifai');
var microsoft = require('../../api/microsoft');
var caption = require('../../api/caption');

// techdebt: break upload into several functions to make it readable
exports.upload = function(req, res) {
  if (!req.file) {
    console.log('Multer failed to save file');
    res.status(404).send();
  } else {
    awsClient.upload('uploads/' + req.file.filename, {}, function(err, versions, meta) {
      if (err) { 
        console.log('s3 upload error: ', err); 
      } 

      versions.forEach(function(image) {
        // S3-uploader library returns all images, including created thumbnails. Use only the original image
        if (image.original) {

          // Create the memory document and save to the server
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

            // Call Clarifai API and store results
            clarifai(image.url).then(function(tag) {
              var results = {
                api: 'clarifai',
                tags: tag.classes,
                original: tag
              };

              memory.analyses.push(results);
              memory.save();
            });

            // Call Microsoft API and store results
            microsoft(image.url).then(function(tags) {
              var results = {
                api: 'microsoft',
                tags: []
              };

              // Save original results
              results.original = tags;

              // Filter by tags of 0.5 score or higher
              tags.forEach(function(tag) {
                if (tag.confidence > 0.5) {
                  results.tags.push(tag.name);
                }
              });

              memory.analyses.push(results);
              memory.save();
            });

            caption('https://s3-us-west-1.amazonaws.com/invalidmemories/images/02c9dce5-e903-4396-82ea-66f5892a821e-large.jpg', 
              function(err, content) {
                if (err) {
                  console.log('err getting caption', err);
                } else {
                  var results = {
                    api: 'caption',
                    tags: [content],
                    original: content
                  };
                memory.analyses.push(results);
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
  }
};

exports.fetchMemories = function(req, res) {
  User.findOne({ username: req.user.username }).populate('memories').then(function(user) {
    res.status(200).send(user.memories);
  }).catch(function(err) {
    console.log('Error retrieving user,', err);
    res.status(404).send();
  });
};

exports.fetchOne = function(req, res) {
  Memory.findOne({ _id: req.params.id }).then(function(memory) {
    res.status(200).send(memory);
  }).catch(function(err) {
    res.status(404).send();
  });
};

exports.storeTags = function(req, res) {
  // If there is no JSON body, return 400
  if (!req.body || !req.body.tags) {
    return res.sendStatus(400);
  }

  Memory.findOne({ _id: req.params.id }).then(function(memory) {
    console.log('tags:', req.body.tags);
    console.log('found memory:', memory);
    memory.tags = req.body.tags;
    memory.save(function(err) {
      if (err) {
        console.log('Error saving tags:', err);
        res.sendStatus(404);
      }

      res.sendStatus(201);
    });
  }).catch(function(err) {
    console.log('Error retrieving memory with ID:', req.params.id);
    res.status(404).send();
  });
};