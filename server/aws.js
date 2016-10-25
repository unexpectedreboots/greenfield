var AWS = require('aws-sdk');

var Upload = require('s3-uploader');

// AWS.config.region = 'us-west-1';
// var s3bucket = AWS.S3({params: {Bucket: 'invalidmemories'}});

var client = new Upload('invalidmemories', {
	aws: {
		path: 'images/',
		region: 'us-west-1',
		acl: 'public-read'
	},

	cleanup: {
    versions: true,
    original: false
  },
 
  original: {
    awsImageAcl: 'public-read'
  },
 
  versions: [{
    maxHeight: 1040,
    maxWidth: 1040,
    format: 'jpg',
    suffix: '-large',
    quality: 80,
    awsImageExpires: 31536000,
    awsImageMaxAge: 31536000
  },{
    maxWidth: 780,
    aspect: '3:2!h',
    suffix: '-medium'
  },{
    maxWidth: 320,
    aspect: '16:9!h',
    suffix: '-small'
  },{
    maxHeight: 100,
    aspect: '1:1',
    format: 'png',
    suffix: '-thumb1'
  },{
    maxHeight: 250,
    maxWidth: 250,
    aspect: '1:1',
    suffix: '-thumb2'
  }]
});

client.upload('../uploads/bill1.jpg', {}, function(err, versions, meta) {
	if (err) { 
		console.log('our error is', err); 
		throw err;
	} 

	versions.forEach(function(image) {
		console.log(image.width, image.height, image.url);
	});
});
