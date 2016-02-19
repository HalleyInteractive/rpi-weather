
var assert = require('chai').assert;
var settings = require('../settings.js');
var request = require('request');
var server = null;
var base_url = 'http://localhost:' + settings.SERVER_PORT;

describe("Webserver for the API", function() {

	it("Should start a webserver for the weather API and add a few readings",
	function(done) {
		server = require('./../server.js');
		done();
	});

	it("Should return last temperature entry", function(done) {
		request(base_url + '/api/', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				settings.test_values.tomorrow);
			done();
		});
	});

	it("Should return todays entries", function(done){
		request(base_url + '/api/today', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.test_values.today,
					settings.test_values.max,
					settings.test_values.min
				]);
			done();
		});
	});

	it("Should return this weeks entries", function(done){
		request(base_url + '/api/week/', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.test_values.yesterday,
					settings.test_values.today,
					settings.test_values.max,
					settings.test_values.min
				]);
			done();
		});
	});

	it("Should return extremes", function(done){
		request(base_url + '/api/extremes/', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				{
					max: settings.test_values.max,
					min: settings.test_values.min
				});
			done();
		});
	});

	it("Should return filtered extremes", function(done) {

		var yesterday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY -
		settings.MILLISECONDS_IN_DAY;

		var justBeforeToday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY - 1000;

		request(base_url + '/api/extremes/' + yesterday + '/' + justBeforeToday,
		function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				{
					max: settings.test_values.yesterday,
					min: settings.test_values.yesterday
				});
			done();
		});
	});

	it("Should return yesterdays entries", function(done) {

		var yesterday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY -
		settings.MILLISECONDS_IN_DAY;

		var justBeforeToday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY - 1000;

		request(base_url + '/api/' + yesterday + '/' + justBeforeToday,
		function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.test_values.yesterday
				]);
			done();
		});
	});

	it("Should return yesterdays and todays entries", function(done) {

		request(base_url + '/api/24hours', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.test_values.yesterday,
					settings.test_values.today,
					settings.test_values.max,
					settings.test_values.min
				]);
			done();
		});
	});

});
