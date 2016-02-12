
var assert = require('chai').assert;
var server = null;

describe("Start a webserver for the API", function() {

	it("Should start a webserver for the weather API", function(done) {
		server = require('./../server.js');
		done();
	});

});
