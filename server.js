// ./server.js
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('cors');
var app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/layouts');
mongoose.connection.on('error', function (err) {
	console.log(err);
	var error = require('./routes/error');
	app.use('/', error);
});

mongoose.connection.on('connected', function() {
	var auth = require('./routes/v1/auth');
	app.use('/v1/auth', auth);

	var users = require('./routes/v1/users');
	app.use('/v1/users', users);

	var grids = require('./routes/v1/grids');
	app.use('/v1/grids', grids);

	// var serialized = require('./routes/v1/serialized');
	// app.use('/v1/serialized', serialized)

	// Start Server
	
});

app.listen(3000, function(err) {
	var os = require('os');
	console.log("Server running at "+os.hostname()+":3000");
});	