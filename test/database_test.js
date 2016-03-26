(function() {
  'use strict';
  let db = require('./../src/database.js');
  let settings = require('./../src/settings.js');
  let assert = require('chai').assert;

  settings.DATABASE_FILE = 'test_database.db';

  describe('Database', function() {
  	describe('insert', function() {
  		it('Should add yesterdays temperature', function() {
  			db.init();
  		   return db.insertTemperature(settings.testValues.temperature.yesterday);
      });
      it('Should add todays temperature', function() {
        return db.insertTemperature(settings.testValues.temperature.today);
      });
  	});
  });
/*
  describe('get', function() {
  	it('yesterday, tomorrow should return two rows', function(done) {
  		db.get(
          {
            device: settings.DEVICE_ID,
            metric: 'temperature',
            dateStart: settings.testValues.temperature.yesterday.date - 1,
  			    dateEnd: settings.testValues.temperature.tomorrow.date + 1,
          }, function(rows) {
  			assert.equal(rows.length, 5);
  			assert.deepEqual(rows[0],
  				addQueryProperties(
            settings.testValues.temperature.yesterday, 'temperature'),
  				'Yesterdays date should come back');
  			assert.deepEqual(rows[1],
          addQueryProperties(
  				  settings.testValues.temperature.today, 'temperature'),
  				'Todays date should come back');
  			done();
  		});
  	});
  });

  describe('lastEntry', function() {
  	it('should return the last dummy entry',
  	function(done) {
  		db.getLastEntry(function(row) {
  			assert.deepEqual(row, settings.testValues.temperature.today);
  			done();
  		});
  	});
  });

  function addQueryProperties(object, metric) {
    let queryProperties = {
      device: settings.DEVICE_ID,
      metric: metric,
    };
    return Object.assign(queryProperties, object);
  }
  */
})();
