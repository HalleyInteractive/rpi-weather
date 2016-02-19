var router = require('express').Router();
var db = require('./database.js');
var milliseconds_in_day = 60*60*24*1000;

db.init();

/**
* Standard API route, returns last database entry
*/
router.get('/', function (req, res) {
	db.getLastEntry(function(row) {
		res.json(row);
	});
});

/**
* Get temperatures in a range from start to end date
* @param :start_date {int} Start date
* @param :end_date {int} End date
*/
router.get('/:start_date/:end_date', function(req, res) {
	db.get(req.params.start_date, req.params.end_date,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get max and min temperature recorded
*/
router.get('/extremes', function(req, res) {
	db.extremes(null, null,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get extremes in a range from start to end date
* @param :start_date {int} Start date
* @param :end_date {int} End date
*/
router.get('/extremes/:start_date/:end_date', function(req, res) {
	db.extremes(req.params.start_date, req.params.end_date,
	function(rows) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from today
*/
router.get('/today', function(req, res) {
	var now = new Date();
	var milliseconds_today = ((now.getHours() * 60 * 60) +
	(now.getMinutes() * 60) + now.getSeconds()) * 1000;

	db.get(now.getTime() - milliseconds_today - 1000, now.getTime(),
	function(rows, test) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from this week
*/
router.get('/week', function(req, res) {
	var now = new Date();
	var milliseconds_today = ((now.getHours() * 60 * 60) +
	(now.getMinutes() * 60) + now.getSeconds()) * 1000;

	db.get(now.getTime() - milliseconds_today - (milliseconds_in_day * 6),
	now.getTime(), function(rows) {
		res.json(rows);
	});
});

/**
* Get all temperature readings from the last 24 hours
*/
router.get('/24hours', function(req, res) {
	var now = new Date();
	db.get(now.getTime() - milliseconds_in_day, now.getTime(),
	function(rows) {
		res.json(rows);
	});
});

module.exports = router;
