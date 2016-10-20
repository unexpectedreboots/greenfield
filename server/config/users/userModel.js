var mongoose = require('../db-config');
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

