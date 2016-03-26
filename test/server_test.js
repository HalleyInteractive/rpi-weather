
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
