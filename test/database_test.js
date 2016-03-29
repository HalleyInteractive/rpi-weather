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

  describe('get', function() {
  	it('yesterday and today should be returned', function(done) {
  		db.getTemperature({
        dateStart: settings.testValues.temperature.yesterday.date - 1,
  			dateEnd: settings.testValues.temperature.today.date + 1,
      })
      .then((rows) => {
        assert.equal(rows.length, 2);
        assert.deepEqual(rows[0], settings.testValues.temperature.today,
          'Todays date should come back');
      	assert.deepEqual(rows[1], settings.testValues.temperature.yesterday,
      	   'Yesterdays date should be returned');
        done();
  		})
      .catch((error) => {
        done(error);
      });
  	});
  });

  describe('lastEntry', function() {
  	it('should return the last dummy entry',
  	function(done) {
  		db.getLastTemperatureEntry()
      .then((row) => {
  			assert.deepEqual(row, settings.testValues.temperature.today);
  			done();
  		})
      .catch((error) => {
        done(error);
      });
  	});
  });
})();
