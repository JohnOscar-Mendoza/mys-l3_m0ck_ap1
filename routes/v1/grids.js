// ./routes/grids.js
var async = require('async');
var express = require('express');
var colors = require('colors');
var router = express.Router();
var mongoose = require('mongoose');
var Users = require('../../models/v1/Users');
var Grids = require('../../models/v1/Grids');
var Layouts = require('../../models/v1/Layouts');
var hidden_fields = { __v: 0, is_removed: 0 };
var response = {} ;
var new_id;

router.get('/:user_id', function(req, res, next) {
	
	console.log((req.method+' at /v1/grids/').green);

	/*
	Waterfall queue
	1. Get User
	1. Get Grids
	2. Format Results
	*/

	async.waterfall([
		async.apply(getUser, req.params.user_id),
		// get_grids,
		formatResults
		// displayResults
		], function(err, user) {
			if(err) {
				res.json({ message: err });
				res.end();
				next();
			}
			else {
				res.json(user);
				res.end();
				next();
			}
		});


	function getUser( userId, callback ) {
		Users.findById(userId, hidden_fields)
		// .populate('grid_id', hidden_fields)
		.populate({ 
			path: 'grid_id', 
			model: 'grids',
			select: hidden_fields,
			populate: {
				path: 'layout_id',
				component: 'layouts',
				select: hidden_fields
			}
		})
		.exec(function(err, result) {
			if(err || result.length <= 0) {

				callback(err, null);
			}
			else {
				callback(null, result);
			}
		});
	}

	function getGrids( callback ){
		Grids.find({ is_removed: 0}, hidden_fields)
		.populate('layout_id', hidden_fields, { is_removed: false })
		.exec(function(err, results) {
			if(err || results.length <= 0) {
				res.json({ message: 'No record found' });
				return;
			}
			else {
				callback(null, results);				
			}

		});
	}

	function formatResults( user, callback ) {
		
		var userObj = user;
		async.forEach( userObj.grid_id, function(grid, forEachCallBack) {
			var arr = [];
			userObj.grid_id.forEach( function(value) {
				var inside = {};
				value.layout_id.forEach( function(li_value) {
					inside[li_value.size] = li_value;
				});
				arr.push( { _id: value._id, layouts: inside} );
			});
			forEachCallBack(arr);
		},
		function(formatted) {
			if( formatted ) {
				callback(null, formatted);
			} else {
				callback('Error processing data', null);
			}
		});

	}

	function displayResults( user, formatted, callback ) {
		user["grid_id"]=formatted;
		callback(null, user);
	}

});

router.post('/:userId', function(req, res, next) {

	console.log((req.method+' at /v1/grids/').red);
	
	/* Waterfall Process
	1. Check if user exists
	2. Create Grid
	3. Layout
	4. Update Grid
	5. Get Grid
	*/

	async.waterfall([
		async.apply(getUser, req.params.userId, req.body),
		createGrid,
		createLayout,
		updateGrid,
		updateUserGrid,
		getUser
		], 
		function(err, results) {
			if(err) {
				console.log(err);
				res.json(err);
			}
			else {
				res.status(201);
				res.json(results);
				res.end();
				next();
			}
		});

	function getUser(userId, requestBody, callback) {
		
		Users.findById(userId, hidden_fields)
		// .populate('grid_id', hidden_fields)
		.populate({ 
			path: 'grid_id', 
			model: 'grids',
			select: hidden_fields,
			populate: {
				path: 'layout_id',
				component: 'layouts',
				select: hidden_fields
			}
		})
		.exec(function(err, result) {
			if(err || result.length <= 0) {

				callback(err, null, null);
			}
			else {
				callback(null, result, requestBody);
			}
		});
	}

	function createGrid(user, requestBody, callback) {

		Grids.create( { }, function(err, grid) {
			if(err || grid.length <= 0) {
				callback(err, null, null);
			}
			else {
				callback(null, user, grid._id, requestBody);
			}
			
		} );

	}

	function createLayout(user, gridId, requestBody ,callback) {

		Layouts.create(Object.assign({grid_id: gridId}, requestBody), function(err, layouts) {
			if(err) {
				console.log(err);
				// res.json({ message: 'Missing Required Parameter' });
				res.json({ message: 'Missing Required Parameter',
					fn: 'createLayout'
				});

			}

			callback(null, user, gridId, layouts._id);
		})

	}

	function updateGrid(user, gridId, layoutId, callback) {

		Grids.findByIdAndUpdate(gridId, { $push: { layout_id: layoutId } }, { upsert: true }, function( err, grid) {
			if(err) {
				console.log(err);
				res.json({ message: 'Missing Required Parameter',
					fn: 'updateGrid'
				});
			}
			else {
				callback(null, user, grid._id);				
			}

		});
	}

	function updateUserGrid(user, gridId, callback) {

		Users.findByIdAndUpdate(user._id, { $push: { grid_id: gridId } }, { upsert: true }, function(err, user) {
			if(err || user.length <= 0) {
				callback(err, null, null);
			}
			else {
				callback(null, user._id, {});
			}
		});
	}

	function getGrid(gridId, callback) {
		
		Grids.findById(gridId, hidden_fields)
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

// router.get('/:grid_id', function(req, res, next) {

// 	Grids.findById(req.params.grid_id, hidden_fields)
// 	.populate('layout_id', hidden_fields)
// 	.exec(function(err, result) {
// 		if(err) {
// 			res.json({ message: 'No record found' });
// 			return;
// 		}

// 		res.json(result);
// 	});

// })

module.exports = router;