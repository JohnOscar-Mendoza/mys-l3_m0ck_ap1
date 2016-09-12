// ./routes/graphs.js
// var async = require('async');
var express = require('express');
var router = express.Router();
var fs = require('fs');
router.get("/", function(req, res, next) {
	// console.log(__dirname);
	fs.readFile(__dirname+'/mock_responses/graphs.json', function(err, file) {
		res.json(JSON.parse(file));
	});

});

module.exports = router;