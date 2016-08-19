// ./routes/grids.js
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Grids = require('../../models/v1/Grids');
var Layouts = require('../../models/v1/Layouts');
var hidden_fields = { __v: 0, is_removed: 0 };
var response = {} ;
var new_id;

router.get('/', function(req, res, next) {
	
	Grids.find({ is_removed: 0}, hidden_fields)
	.populate('layout_id', hidden_fields)
	.exec(function(err, results) {
		if(err) {
			res.json({ message: 'No record found' });
			return;
		}

		res.json(results);
	});

});

router.post('/', function(req, res, next) {

	Layouts.create(req.body, function(err, layouts) {
		if(err) {
			// I dont know what the errors specifically are I just assumed that an object key is missing
			res.json(req.body);
			res.json({ message: 'Missing Required Parameter' });
			return;
		}

		Grids.create({ layout_id: [ layouts._id ] }, function(err, grid) {
			if(err) {
				// I dont know what the errors specifically are I just assumed that an object key is missing
				res.json(req.body);
				res.json({ message: 'Missing Required Parameter' });
				return;
			}
			Grids.findOne(grid)
			.populate('layout_id')
			.exec(function (err, result) {
				res.json(result);
			})
		});
		
	});

});

router.put('/:id', function (req, res, next) {

	Layouts.findByIdAndUpdate(req.params.id, req.body, function (err, result) {
		if(err) {
			res.json(req.body);
			res.json({ message: 'Missing Required Parameter' });
			return;
		}

		Layouts.findById(result._id, hidden_fields, function( err, layout) {

			if(err) {
				res.json(req.body);
				res.json({ message: 'Missing Required Parameter' });
				return;
			}

			res.json(layout);

		});

	});

});


router.delete('/:id', function(req, res, next) {

	Grids.findByIdAndUpdate(req.params.id, {is_removed: 1}, function (err, result) {
		if(err) {
			res.json(req.body);
			res.json({ message: 'Missing Required Parameter' });
			return;
		}

		res.json({ _id: req.params.id, removed: true});

	});


});

router.get('/:id', function(req, res, next) {

	Grids.findById(req.params.id, hidden_fields)
	.populate('layout_id', hidden_fields)
	.exec(function(err, result) {
		if(err) {
			res.json({ message: 'No record found' });
			return;
		}

		res.json(result);
	});

})

module.exports = router;