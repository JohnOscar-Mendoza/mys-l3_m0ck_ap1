// ./routes/auth.js
var async = require('async');
var express = require('express');
var colors = require('colors');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../../models/v1/Users');

var algoliasearch = require('algoliasearch');
var client = algoliasearch("LA26HQXG0F", "718c4c7fe8b59f9cd54f2c90ed65bde2");
var index = client.initIndex('users');

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

	async.waterfall([
		createUsers,
		addToAlgolia,
		getUser
		], function(err, results){
			if(err) {
				console.log(err);
				if(err.code == 11000) {
					res.status(200);
					res.json({"message": "Duplicate key value pair"});
				}
				res.end();
				next();
				return;

			} else {
				res.status(201);
				res.json(results);
				res.end();
				next();
			}
		})

	function createUsers(callback) {

		Users.create(req.body, function(err, user) {
			if(err) {
				callback(err, null);
			} else {

				callback(null, user);

			}

		});
	};

	function addToAlgolia(user, callback) {
		index.addObject({
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email
		}, function(err, content) {
			if(err) {
				console.log(err);
			} else {
				console.log('Appended to Algolia: objectID=' + content.objectID);
			}
			callback(user);
		});
	}

	function getUser(user, callback){
		Users.findById(user._id, hidden_fields, function(err, result) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });
				res.end();
				next();

			} else {
				callback(null, result);
			}

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
				// res.json(err);
				res.end();
				next();
			}
			else {
				callback(null, result._id);				
			}

		});
	}

	function getUser(userId, callback){
		Users.findById(userId, hidden_fields, function(err, result) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });

			} else {
				callback(null, result);
			}

		});
	}
	

});

module.exports = router;