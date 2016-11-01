var transloadit = require('node-transloadit');

var client = new transloadit(
  '8a87b470a08611e6829ce1fc61bcc136',
  'c13e43c6792aca5c9c8c1c93f012d2e91c6fc89b'
);

var params = {
  steps: {
    ':original': {
      robot: '/http/import',
      url: 'http://techslides.com/demos/sample-videos/small.mp4'
      // TODO: make dynamic
    },
    'store': {
      use: ':original',
      robot: '/s3/store',
      key: 'AKIAJTWXU5UJG3U627AQ',
      secret: 'Z04NHQOrWc8ti89I2wZ3fYlFi+Xgw/tRjm/DkGVO',
      bucket: 'unexpected-reboots-videos'
    }
  }
};

module.exports.uploadVideo = function(callback) {
  // TODO: add argument to accept file path
  client.send(params, function(success) {
    callback('Success:', JSON.stringify(success));
  }, function (err) {
    callback('Error:', JSON.stringify(err));
  });
};
