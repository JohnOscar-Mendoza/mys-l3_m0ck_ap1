// ./tests/test-register.js
var test = require('tape').test;
var request = require('request');
var os = require('os');



var postLogin = function(url, params, callback) {

	request.post(url, { form: params }, function(error, response, body) {
		if(!error && response.statusCode == 200) {
			callback(null, body, response.statusCode);
		}
		else {
			callback(error, null, response.statusCode);
		}
	} );
}

test('Logging in a user', function(t) {

	var requestBody = {
		username: 'newUsername',
		password: 'encrypted_password',
	};

	var url = 'http://'+os.hostname()+':3000/v1/auth/login/';
	postLogin(url, requestBody, function(err, body, statusCode) {

		var actual = statusCode;
		var expect = 200;
		t.equal(actual, expect, 'Response status should be 201');
		t.end();

	});
});

test('Fail login', function(t) {
	
	var requestBody = {
		username: 'newUsernam',
		password: 'encrypted_password',
	};

	var url = 'http://'+os.hostname()+':3000/v1/auth/login/';
	postLogin(url, requestBody, function(err, body, statusCode) {

		var actual = statusCode;
		var expect = 401;
		t.equal(actual, expect, 'Response status should be 201');
		t.end();

	});

})