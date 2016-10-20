var express = require('express');

var app = express();


// app.use(express.static(__dirname + '/client'/* TODO: insert/change client folder path here */));

var port = 3000;

app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;