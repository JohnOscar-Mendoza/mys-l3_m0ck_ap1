// ./routes/auth.js
var async = require('async');
var express = require('express');
var colors = require('colors');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../../models/v1/Users');

var hidden_fields = { __v: 0, is_removed: 0, password: 0 };

router.get('/', function(req, res, next) {

	console.log((req.method+' at /v1/users/').green);

	Users.find({is_removed:0}, hidden_fields, function(err, results) {

		if (!err){
			res.status(200);
			res.json(results)
			res.end();
			next();
		}
		else {
			res.status(200);
			res.json({message: "No record found"});
			res.end();
			next();
		}

	});

});

router.get('/:user_id', function(req, res, next) {

	console.log((req.method+' at /v1/users/:user_id').green);

	Users.findById(req.params.user_id, {is_removed: 0}, function(err, result) {

		if (!err){
			res.status(200);
			res.json(result)
			res.end();
			next();
		}
		else {
			res.status(200);
			res.json({message: "No record found"});
			res.end();
			next();
		}

	});

});

router.post('/', function(req, res, next) {

	/*
	Waterfall series
	1. Create user 
	2.
	*/
	async.waterfall([

		createUsers,
		getUser


		], function(err, results){
			if(err) {
				console.log(err);
				res.json(err);

			}

			res.status(201);
			res.json(results);
			res.end();
			next();
		})

	function createUsers(callback) {

		Users.create(req.body, function(err, user) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });
				// res.json(err);

			}

			callback(null, user._id);
		});
	};

	function getUser(userId, callback){
		Users.findById(userId, hidden_fields, function(err, result) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });

			}

			callback(null, result);
		});
	}

});

router.put('/:user_id', function(req, res, next) {

	async.waterfall([
		updateUser,
		getUser
		], function(err, results) {

			if(err) {
				console.log(err);
				res.json(err);

			}

			res.status(201);
			res.json(results);
			res.end();
			next();

		})

	function updateUser(callback) {
		Users.findByIdAndUpdate(req.params.user_id, req.body, function(err, result) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });

			}

			callback(null, result._id);
		});
	}

	function getUser(userId, callback){
		Users.findById(userId, hidden_fields, function(err, result) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });

			}

			callback(null, result);
		});
	}
	

});

module.exports = router;