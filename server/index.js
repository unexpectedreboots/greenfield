var express = require('express');

var bodyParser = require('body-parser');

var app = express();

// host static client files on server
// app.use(express.static(__dirname + '/client'/* TODO: insert/change client folder path here */));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure server with routes
require('./config/routes')(app, express);

//start listening on given port
var port = 3000;
app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;