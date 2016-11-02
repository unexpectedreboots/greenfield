var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:admin@ds141697.mlab.com:41697/tagme');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('db is open!');
});


module.exports = mongoose;