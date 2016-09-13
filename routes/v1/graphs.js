// ./routes/graphs.js
// var async = require('async');
var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get("/one/", function(req, res, next) {
	console.log((req.method + " called at /v1/graphs/one/").green);
	fs.readFile(__dirname+'/mock_responses/graphs.json', function(err, file) {
		res.json(JSON.parse(file));
	});

});

router.get("/two/", function(req, res, next) {
	console.log((req.method + " called at /v1/graphs/two/").green);
	fs.readFile(__dirname+'/mock_responses/graphs_two.json', function(err, file) {
		res.json(JSON.parse(file));
	});

});

module.exports = router;