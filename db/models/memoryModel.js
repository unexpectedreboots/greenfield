var mongoose = require('../config/db');
var Schema = mongoose.Schema;

var memorySchema = new Schema({
  title: String,
  filePath: String,
  createdAt: Date,
  analyses: [],
  tags: []
});

module.exports = mongoose.model('Memory', memorySchema);