// ./routes/layouts.js
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Layouts = require('../../models/v1/Layouts');
var hiddenFields = { __v: 0, is_removed: 0 };

router.get('/', function(req, res, next) {
	
	Layouts.find({}, hiddenFields, function(err, layouts) {

		if(err) {
			res.json({ message: 'No record found' });
			return;
		}

		res.json(layouts);
	});

});

router.post('/', function(req, res, next) {

	var newId;
	Layouts.create(req.body, function(err, layouts) {
		if(err) {
			// I dont know what the errors specifically are I just assumed that an object key is missing
			res.json({ message: 'Missing Required Parameter'});
			return;
		}

		this.newId = layouts._id;
		Layouts.findById(this.newId, hiddenFields, function(err, layouts) {
			if(err) {
				// I dont know what the errors specifically are I just assumed that a document is not found
				res.json({ message: 'Layout not Found'});
				return;
			}

			res.json(layouts);
		});
	});
});

module.exports = router;