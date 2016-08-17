// ./routes/layouts.js

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Layouts = require('../models/Layouts');

router.get('/', function(req, res, next) {

	Layouts.find(function(err, layouts){

		if(err) {
			return next(err);
		}

		res.json(layouts);

	});

});

router.post('/', function(req, res, next) {

	Layouts.create(req.body, function(err, layouts) {

		if(err) {
			return next(err);
		}

		res.json(layouts);

	})

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

	Layouts.findByIdAndUpdate(req.params.id, { isRemoved: true }, function(err, layouts) {
		if(err) {
			return next(err);
		}

		res.json(layouts);
	})
});


module.exports = router;