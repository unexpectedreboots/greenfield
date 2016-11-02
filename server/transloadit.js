var keys = require('./config/keys');
var transloadit = require('node-transloadit');
//test
var client = new transloadit(
  keys.TRANSLOADIT_KEY,
  keys.TRANSLOADIT_SECRET
);

module.exports.addVideo = function(fileName, filePath) {
  client.addFile(fileName, __dirname + filePath);
};

var params = {
  steps: {
    ':original': {
      robot: '/video/encode',
    },
    'store': {
      use: ':original',
      robot: '/s3/store',
      key: keys.AWS_KEY,
      secret: keys.AWS_SECRET,
      bucket: 'unexpected-reboots-videos'
    }
  }
};

module.exports.batchUpload = function(callback) {
  client.send(params, function(success) {
    callback('Success:', JSON.stringify(success));
  }, function (err) {
    callback('Error:', JSON.stringify(err));
  });
};
