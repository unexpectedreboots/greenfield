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
  }
};
