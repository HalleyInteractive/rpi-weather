var router = require('express').Router();
var Database = require('./database.js');
var db = new Database();
var milliseconds_in_day = 60*60*24*1000;

db.init();

router.get('/', function (req, res) {
	db.getLastEntry(function(row) {
		res.json(row);
	});
});

router.get('/:start_date/:end_date', function(req, res) {
	db.get(req.params.start_date, req.params.end_date, function(rows) {
		res.json(rows);
	});
});

router.get('/extremes', function(req, res) {
	db.extremes(null, null, function(rows) {
		res.json(rows);
	});
});

router.get('/extremes/:start_date/:end_date', function(req, res) {
	db.extremes(req.params.start_date, req.params.end_date, function(rows) {
		res.json(rows);
	});
});

router.get('/today', function(req, res) {
	var now = new Date();
	var milliseconds_today = ((now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds()) * 1000;
	db.get(now.getTime() - milliseconds_today - 1000, now.getTime(), function(rows, test) {
		res.json(rows);
	});
});

router.get('/week', function(req, res) {
	var now = new Date();
	var milliseconds_today = ((now.getHours() * 60 * 60) + (now.getMinutes() * 60) + now.getSeconds()) * 1000;
	db.get(now.getTime() - milliseconds_today - (milliseconds_in_day * 6), now.getTime(), function(rows) {
		res.json(rows);
	});
});

module.exports = router;
