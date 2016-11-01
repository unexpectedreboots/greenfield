var TransloaditClient = require('transloadit');
var transloadit = new TransloaditClient({
  authKey: '',
  authSecret: ''
});

var params = {
  encode: {
    use: ':original',
    robot: '/video/encode',
    preset: 'iphone'
  },
  store: {
    use: 'encode',
    robot: '/s3/store',
    key: 'YOUR_AMAZON_S3_KEY',
    secret: 'YOUR_AMAZON_S3_SECRET',
    bucket: 'YOUR_AMAZON_S3_BUCKET'
  }
};
