var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/greenfieldDB');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function() {
  console.log('db is open!');
});

