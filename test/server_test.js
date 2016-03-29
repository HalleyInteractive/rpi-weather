
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

    it('Should return home page', function(done) {
  		request(baseUrl + '/', function(error, response) {
  			assert.isNull(error);
  			assert.equal(response.statusCode, 200);
  			done();
  		});
  	});

    it('Should return the chart page', function(done) {
  		request(baseUrl + '/chart', function(error, response) {
  			assert.isNull(error);
  			assert.equal(response.statusCode, 200);
  			done();
  		});
  	});

  	it('Should return last entries', function(done) {
  		request(baseUrl + '/api/', function(error, response) {
  			assert.isNull(error);
  			assert.equal(response.statusCode, 200);
  			assert.deepEqual(JSON.parse(response.body).temperature,
  				settings.testValues.temperature.today);
        assert.deepEqual(JSON.parse(response.body).humidity,
    			settings.testValues.humidity.today);
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
        assert.deepEqual(JSON.parse(response.body).humidity,
  				[
            settings.testValues.humidity.today,
  					settings.testValues.humidity.yesterday,
  				]);
  			done();
  		});
  	});

  });
})();
