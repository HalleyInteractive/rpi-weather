
var assert = require('chai').assert;
var settings = require('../src/settings.js');
var request = require('request');
var server = null;
var baseUrl = 'http://localhost:' + settings.SERVER_PORT;

describe('Webserver for the API', function() {

	it('Should start a webserver for the weather API and add a few readings',
	function(done) {
		server = require('./../src/server.js');
		server.init();
		done();
	});

	it('Should return last temperature entry', function(done) {
		request(baseUrl + '/api/', function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				settings.testValues.tomorrow);
			done();
		});
	});

	it('Should return todays entries', function(done){
		request(baseUrl + '/api/today', function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.testValues.today,
					settings.testValues.max,
					settings.testValues.min
				]);
			done();
		});
	});

	it('Should return this weeks entries', function(done){
		request(baseUrl + '/api/week/', function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.testValues.yesterday,
					settings.testValues.today,
					settings.testValues.max,
					settings.testValues.min
				]);
			done();
		});
	});

	it('Should return extremes', function(done){
		request(baseUrl + '/api/extremes/', function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				{
					max: settings.testValues.max,
					min: settings.testValues.min
				});
			done();
		});
	});

	it('Should return filtered extremes', function(done) {

		var yesterday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY -
		settings.MILLISECONDS_IN_DAY;

		var justBeforeToday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY - 1000;

		request(baseUrl + '/api/extremes/' + yesterday + '/' + justBeforeToday,
		function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				{
					max: settings.testValues.yesterday,
					min: settings.testValues.yesterday
				});
			done();
		});
	});

	it('Should return yesterdays entries', function(done) {

		var yesterday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY -
		settings.MILLISECONDS_IN_DAY;

		var justBeforeToday = settings.now.getTime() -
		settings.MILLISECONDS_TODAY - 1000;

		request(baseUrl + '/api/' + yesterday + '/' + justBeforeToday,
		function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.testValues.yesterday
				]);
			done();
		});
	});

	it('Should return yesterdays and todays entries', function(done) {

		request(baseUrl + '/api/24hours', function(error, response) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			assert.deepEqual(JSON.parse(response.body),
				[
					settings.testValues.yesterday,
					settings.testValues.today,
					settings.testValues.max,
					settings.testValues.min
				]);
			done();
		});
	});

});
