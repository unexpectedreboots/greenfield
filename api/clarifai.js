var requestPromise = require('request-promise');

module.exports = function(pubUrl) {
  var clarifaiToken = 'b3v0kcDuAnAZzrnBNfw5GjiSyLBbaD';
  return requestPromise({
    uri: 'https://api.clarifai.com/v1/tag/?url=' + pubUrl, 
    method: 'GET',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + clarifaiToken
    }
  }).then(function(res) {
    console.log('clarifai request successful');
    return res.results[0].result.tag;
  }).catch(function(err) {
    console.log('error requresting from clarifai', err);
  });
};