// ./routes/layouts.js
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Layouts = require('../models/Layouts');
var hiddenFields = { __v: 0, is_removed: 0 };

router.get('/', function(req, res, next) {

	Layouts.find({}, hiddenFields, function(err, layouts) {
		if(err) {
			return next(err);
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

router.put('/:id', function(req, res, next) {

	var newId;
	Layouts.findByIdAndUpdate(req.params.id, req.body, function(err, layouts) {

		if(err) {
			// I dont know what the errors specifically are I just assumed that a document is not found
			res.json({ message: 'Layout not Found'});
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
})

router.delete('/:id', function(req,res,next) {

	Layouts.findByIdAndUpdate(req.params.id, { is_removed: true }, function(err, layouts) {
		if(err) {
			// I dont know what the errors specifically are I just assumed that a document is not found
			res.json({ message: 'Layout not Found'});
			return;
		}

		res.json( {  id: req.params.id, remove: true } );
	})
});


module.exports = router;