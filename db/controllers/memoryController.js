var Memory = require('../models/memoryModel');

exports.upload = function(req, res) {
  console.log('POST: /api/memories/upload');
  // TODO: fill this logic out
  console.log('req.file is now', req.file);
  console.log('REQUEST', req);
  console.log('TYPE', typeof req.body.memoryImage);
  res.send();
};

exports.fetchMemories = function(req, res) {

};

exports.fetchOne = function(req, res) {

};

var addOne = function(req, res) {

};