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
			return next(err);
		}

		this.newId = layouts._id;
		Layouts.findById(this.newId, hiddenFields, function(err, layouts) {
			if(err) {
				return next(err);
			}

			res.json(layouts);
		});
	});
	
	

});

router.put('/:id', function(req, res, next) {

	Layouts.findByIdAndUpdate(req.params.id, req.body, function(err, layouts) {

		if(err) {
			return next(err);
		}

		res.json(layouts);
	});
})

router.delete('/:id', function(req,res,next) {

	Layouts.findByIdAndUpdate(req.params.id, { is_removed: true }, function(err, layouts) {
		if(err) {
			return next(err);
		}

		res.json(layouts);
	})
});


module.exports = router;