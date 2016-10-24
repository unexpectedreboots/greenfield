var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds031157.mlab.com:31157/heroku_vt7nx6q4');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('db is open!');
});


module.exports = mongoose;