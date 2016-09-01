// ./routes/auth.js
var async = require('async');
var express = require('express');
var colors = require('colors');
var router = express.Router();
var mongoose = require('mongoose');
var Auth = require('../../models/v1/Auth');

var hidden_fields = { __v: 0, is_removed: 0, password: 0 };

router.post('/register', function(req, res, next) {

	console.log((req.method+' at /v1/auth/register/').red);

	Auth.create( req.body, function(err, user) {
		if(!err){
			res.status(201);
			res.json(user);
			res.end();
			next();
		}
		else {
			console.log(err);
			res.status(400);
			res.json({ message: 'Missing required parameter' });
			res.end();
			next();
		}
	} );

});

router.post('/login', function(req, res, next) {

	console.log((req.method+' at /v1/auth/login/').red);

	var params = req.body;
	Auth.findOne(
		{ is_removed: 0, username: params.username, password: params.password },
		hidden_fields, 
		function(err, result) {
			if( !err && result != null ) {
				res.json(result);
				res.end();
				next();
			}
			else {
				res.status(401);
				res.json({ message: 'Missing required parameter' });
				res.end();
				next();				
			}
		})

});

module.exports = router;