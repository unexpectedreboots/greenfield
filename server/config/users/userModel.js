var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String,
  memories: [{
    type: Schema.Types.ObjectId,
    ref: 'Memory'
  }]
});

module.exports = mongoose.model('User', userSchema);

