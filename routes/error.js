// ./routes/layouts.js
var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
	res.status(500);
	res.json({error: "Server Connection Error"});
	res.end();
	next();
});

module.exports = router;