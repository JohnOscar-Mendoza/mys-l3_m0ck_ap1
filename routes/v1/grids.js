// ./routes/grids.js
var async = require('async');
var express = require('express');
var colors = require('colors');
var router = express.Router();
var mongoose = require('mongoose');
var Grids = require('../../models/v1/Grids');
var Layouts = require('../../models/v1/Layouts');
var hidden_fields = { __v: 0, is_removed: 0 };
var response = {} ;
var new_id;

router.get('/', function(req, res, next) {
	
	console.log((req.method+' at /v1/grids/').green);
	Grids.find({ is_removed: 0}, hidden_fields)
	.populate('layout_id', hidden_fields, { is_removed: false })
	.exec(function(err, results) {
		if(err) {
			res.json({ message: 'No record found' });
			return;
		}

		// var arr = [];
		// results.forEach( function(value) {

		// 	value.layout_id.forEach( function(li_value) {

		// 	} )

		// } );

		res.json(results);

	});

});

router.post('/', function(req, res, next) {

	console.log(req.method+' at /v1/grids/'.red);
	
	/* Waterfall Process
	1. Create Grid
	2. Layout
	3. Update Grid
	4. Get Grid
	*/

	async.waterfall([
		create_grid,
		create_layout,
		update_grid,
		get_grid
		], 
		function(err, results) {
			if(err) {
				console.log(err);
				res.json(err);
			}

			res.json(results);
			next();
		});

	function create_grid(callback) {

		Grids.create( { }, function(err, grid) {
			if(err) {


				res.json({ message: 'Missing Required Parameter' });

			}
			callback(null, grid._id, req.body);
			return grid._id;
		} );

	}

	function create_layout(gridId, requestBody ,callback) {

		Layouts.create(Object.assign({grid_id: gridId}, requestBody), function(err, layouts) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });

			}

			callback(null, gridId, layouts._id);
		})

	}

	function update_grid(gridId, layoutId, callback) {

		Grids.findByIdAndUpdate(gridId, { $push: { layout_id: layoutId } }, { upsert: true }, function( err, grid) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter' });
			}

			callback(null, grid._id);

		});
	}

	function get_grid(gridId, callback) {
		
		Grids.findById(gridId)
		.populate('layout_id')
		.exec( function (err, result) {

			if(err)
			{
				console.log(err);
				callback(null, { message: "No record found"} );
			}

			callback(null, result)

		});

	}

});

router.post('/:grid_id/layouts/', function( req, res, next) {
	console.log(req.method+' at /'+req.params.grid_id+'/layouts'.red);
	async.waterfall([
		get_grid,
		create_layout,
		update_grid,
		get_udpated_grid
		],
		function(err, results) {

			if(err) {
				console.log(err);
				res.json(err);
				next();
				return;
			}

			console.log(results);
			res.json(results);
			next();
			return;

		});

	function get_grid(callback) {

		Grids.findById(req.params.grid_id, hidden_fields, function(err, grid) {
			if(err || grid == null) {
				callback({ message: 'No record found' }, null);
				return;
			}

			callback(null, grid._id, req.body);
			return;

		});

	}

	function create_layout(gridId, requestBody, callback) {

		Layouts.create(Object.assign({grid_id: gridId}, requestBody), function(err, layout) {
			if(err) {
				if(err.code == 11000) {
					callback({ message: 'Duplicate key' }, null);
					return;
				}

				callback({ message: 'Missing Required Parameter' }, null);
				return;

			}

			callback(null, gridId, layout._id);
			return;
		});

	}

	function update_grid(gridId, layoutId, callback) {

		Grids.findByIdAndUpdate(gridId, { $push: { layout_id: layoutId } }, { upsert: true }, function( err, grid) {
			if(err) {

				callback({ message: 'Missing Required Parameter' }, null);
				return;
			}

			callback(null, grid._id);

		});
	}

	function get_udpated_grid(gridId, callback) {
		Grids.findById(gridId)
		.populate('layout_id')
		.exec( function (err, result) {

			if(err || result == null)
			{
				callback({ message: "No record found"}, null);
				return;
			}

			callback(null, result)

		});

	}

});

router.put('/:grid_id/layouts/:layout_id', function (req, res, next) {

	console.log((req.method+' at /v1/grids/'+req.params.grid_id+'/layouts/'+req.params.layout_id+'/').blue);

	Layouts.findByIdAndUpdate(req.params.layout_id, req.body, function (err, result) {
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

router.delete('/:grid_id', function(req, res, next) {

	Grids.findByIdAndUpdate(req.params.id, {is_removed: 1}, function (err, result) {
		if(err) {
			res.json(req.body);
			res.json({ message: 'Missing Required Parameter' });
			return;
		}

		res.json({ _id: req.params.grid_id, removed: true});

	});


});

router.get('/:grid_id', function(req, res, next) {

	Grids.findById(req.params.grid_id, hidden_fields)
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