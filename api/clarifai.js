var requestPromise = require('request-promise');

module.exports = function(pubUrl) {
  var clarifaiToken = 'NJLX0qdAqLAqFaveSs99SW0wr8rbLY';
  return requestPromise({
    uri: 'https://api.clarifai.com/v1/tag/?url=' + pubUrl, 
    method: 'GET',
    json: true,
    headers: {
      'Authorization': 'Bearer ' + clarifaiToken
    }
  }).then(function(res) {
    return res.results[0].result.tag.classes;
  })
}