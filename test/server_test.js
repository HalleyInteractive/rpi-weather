
(function() {
  'use strict';
  let assert = require('chai').assert;
  let settings = require('../src/settings.js');
  let request = require('request');
  let server = null;
  let baseUrl = 'http://localhost:' + settings.SERVER_PORT;

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
  			assert.deepEqual(JSON.parse(response.body).temperature,
  				settings.testValues.temperature.today);
  			done();
  		});
  	});

  	it('Should return yesterdays and todays temperature entries',
    function(done) {
  		request(baseUrl + '/api/24hours', function(error, response) {
  			assert.isNull(error);
  			assert.equal(response.statusCode, 200);
  			assert.deepEqual(JSON.parse(response.body).temperature,
  				[
            settings.testValues.temperature.today,
  					settings.testValues.temperature.yesterday,
  				]);
  			done();
  		});
  	});

  });
})();
