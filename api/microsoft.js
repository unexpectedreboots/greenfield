var requestPromise = require('request-promise');

module.exports = function(pubUrl) {
  var microsoftToken = 'a720fb93241c49da8aa3c42573b12bba';
  return requestPromise({
    'method': 'POST',
    'uri': 'https://api.projectoxford.ai/vision/v1.0/tag', 
    'json': true, // this option automatically parses the JSON
    'headers': {
      'Ocp-Apim-Subscription-Key': microsoftToken
    },
    'body': {
      url: pubUrl
    }
  }).then(function(res) {
    return res.tags;
  }).catch(function(err) {
    console.log('err requesting from microsoft', err);
  });
};
