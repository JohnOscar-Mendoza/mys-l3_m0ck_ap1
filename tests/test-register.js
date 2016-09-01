// ./tests/test-register.js
var test = require('tape').test;
var request = require('request');
var os = require('os');

var requestBody = {
	email: 'newEmail@test.com',
	username: 'newUsername',
	password: 'encrypted_password',
}

var postAdd = function(url, params, callback) {
	request.post(url, { form: params }, function(error, response, body) {
		if(!error && response.statusCode == 201) {
			callback(null, body, response.statusCode);
		}
		else {
			callback(error, null, response.statusCode);
		}
	} );
}

test('Registering a new user', function(t) {
	var url = 'http://'+os.hostname()+':3000/v1/auth/register/';
	postAdd(url, requestBody, function(err, body, statusCode) {

		var actual = statusCode;
		var expect = 201;
		t.equal(actual, expect, 'Response status should be 201');
		t.end();

	});

});