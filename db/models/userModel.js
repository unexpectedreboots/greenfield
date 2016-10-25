var mongoose = require('../config/db');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true
  },
  password: String,
  memories: [{
    type: Schema.Types.ObjectId,
    ref: 'Memory'
  }]
});

module.exports = mongoose.model('User', userSchema);

