/*
Caption.js takes the given puburl and makes a request to the microsoft api
to return a photo caption
*/
var request = require('request');
var rp = require('request-promise');

// no idea why, but request-promise returns undefined response
// so i use request callback style
var postToCaptionBot = function(pubUrl, cb) {
	var postOptions = {
		uri: 'https://www.captionbot.ai/api/message',
		method: 'POST',
		json: true,
		body: {
			"conversationId": "HqZgT8tkMuh",
			"waterMark":"",
			"userMessage":pubUrl,
		}
	};

	request(postOptions, function(err, res) {
		if (err) {
			console.log('err posting new message', err);
		} else {
			// console.log('got a response to post');
			cb(res);
		}
	});
};

// postToCaptionBot('none', () => {console.log('success');});

var getCaptions = function(cb) {
	var getOptions = {
		uri: 'https://www.captionbot.ai/api/message?waterMark=&conversationId=HqZgT8tkMuh',
		method: 'GET',
		json: true,
		// waterMark: "",
		// conversationId: "HqZgT8tkMuh"
	};

	request(getOptions, function(err, res) {
		if (err) {
			console.log('error getting captions', err);
		} else {
			// console.log('got a response to get: ');
			cb(res);
		}
	});
};

// getCaptions(() => {console.log('success'));

module.exports = function(pubUrl, callback){
	// make a post request with a new pubUrl (and no headers?)
	// if want cookie, here's one for headers: "cookie": "ARRAffinity=7859fc7f1ac791b0bcb882bbc7f322145435064e7832fe2b14cc37ff2d6f16d6; ai_user=tD2IB|2016-10-30T00:13:15.833Z; ai_session=t64z3|1477786397018|1477790490633",
	postToCaptionBot(pubUrl, function(response) {
		if (response.statusCode === 200) {
			// console.log('post successful');
			getCaptions(function(res) {
				if (res.statusCode === 200) {
					var body = JSON.parse(res.body);
					// console.log('messages are', body);
					var lastIndex = body.BotMessages.length-1;
					var message = body.BotMessages[lastIndex];
					var uncertainStartIndex = message.indexOf('I think');

					if (uncertainStartIndex !== -1) {
						var content = message.slice(uncertainStartIndex + 13);
					} else {
						var content = message;
					}
					callback(null, content);
				} else {
					console.log('get response incorrect', res.statusCode);
				}
			});
		} else {
			console.log('post unsuccessful', response.statusCode);
		}
	});
	

	// console.log response
};

// tests work
// module.exports('https://s3-us-west-1.amazonaws.com/invalidmemories/images/02c9dce5-e903-4396-82ea-66f5892a821e-large.jpg', (content)=>{console.log('capition is: ', content);});