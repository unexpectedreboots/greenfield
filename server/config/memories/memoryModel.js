var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memorySchema = new Schema({
  title: String,
  filePath: String,
  createdAt: Date,
  /* TODO: How will we store this data? JSON? stringified? tags? */
  analyses: []
});

module.exports = mongoose.model('Memory', memorySchema);