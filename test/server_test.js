
var assert = require('chai').assert;
var settings = require('../settings.js');
var request = require('request');
var server = null;
var base_url = 'http://localhost:' + settings.server_port;

describe("Webserver for the API", function() {

	it("Should start a webserver for the weather API and add a few readings", function(done) {
		server = require('./../server.js');
		done();
	});

	it("Should return todays temperatures", function(done) {
		request(base_url + '/api/', function(error, response, body) {
			assert.isNull(error);
			assert.equal(response.statusCode, 200);
			done();
		});
	});

});
