var express = require('express');

var bodyParser = require('body-parser');

var userRouter = require('./routers/user-routes');
var protectedRouter = require('./routers/protected-routes');

var app = express();

// host static client files on server
// app.use(express.static(__dirname + '/client'/* TODO: insert/change client folder path here */));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// configure server with routes
app.use('/api/users', userRouter);
app.use('/api/memories', protectedRouter);

// require('./routers/routes')(app, express);

//start listening on given port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Listening on port', port);
});

module.exports = app;