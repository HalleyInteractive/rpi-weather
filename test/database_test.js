var db = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var fs = require('fs');

settings.DATABASE_FILE = 'test_database.db';

describe('Database', function() {
	describe('insert', function() {
		it('Should add three rows', function(done) {
			db.init();
			db.insert(settings.testValues.yesterday, function(err) {
				assert.isNull(err, 'Insert callback returns no error');
				db.insert(settings.testValues.today, function(err) {
					assert.isNull(err, 'Insert callback returns no error');
					db.insert(settings.testValues.tomorrow, function(err) {
						assert.isNull(err, 'Insert callback returns no error');
						db.insert(settings.testValues.max, function(err) {
							assert.isNull(err, 'Insert callback returns no error');
							db.insert(settings.testValues.min, function(err) {
								assert.isNull(err, 'Insert callback returns no error');
								done();
							});
						});
					});
				});
			});
		});
	});

	describe('get', function() {
		it('yesterday, tomorrow should return all 5 rows', function(done) {
			db.get(settings.testValues.yesterday.date - 1,
				settings.testValues.tomorrow.date + 1, function(rows) {
				assert.equal(rows.length, 5);
				assert.deepEqual(rows[0],
					settings.testValues.yesterday, 'Yesterdays date should come back');
				assert.deepEqual(rows[1],
					settings.testValues.today, 'Todays date should come back');
				assert.deepEqual(rows[2],
					settings.testValues.tomorrow, 'Tomorrows date should come back');
				assert.deepEqual(rows[3],
					settings.testValues.max, 'Max value should come back');
				assert.deepEqual(rows[4],
					settings.testValues.min, 'Min value should come back');
				done();
			});
		});

		it('should return yesterday', function(done){
			db.get(settings.testValues.yesterday.date,
				settings.testValues.yesterday.date,
				function(rows) {
					assert.equal(rows.length, 1);
					assert.deepEqual(rows[0], settings.testValues.yesterday);
					done();
				});
		});

		it('should return tomorrow', function(done){
			db.get(settings.testValues.tomorrow.date,
				settings.testValues.tomorrow.date + settings.MILLISECONDS_TODAY,
				function(rows) {
					assert.equal(rows.length, 1);
					assert.deepEqual(rows[0], settings.testValues.tomorrow);
					done();
				});
		});

	});

	describe('extremes', function() {
		it('should return all min and max temperature', function(done) {
			db.extremes(null, null, function(extremes) {
				assert.deepEqual(extremes,{
					min: settings.testValues.min,
					max: settings.testValues.max
				});
				done();
			});
		});

		it('should return filtered min and max temperature', function(done) {
			db.extremes(settings.testValues.tomorrow.date - 1, null,
				function(extremes) {
					assert.deepEqual(extremes, {
						min: settings.testValues.tomorrow,
						max: settings.testValues.tomorrow
					});
					done();
				});
		});

		it('should return filtered min and max temperature', function(done) {
			db.extremes(null, settings.testValues.yesterday.date + 1,
				function(extremes) {
					assert.deepEqual(extremes, {
						min: settings.testValues.yesterday,
						max: settings.testValues.yesterday
					});
					done();
				});
		});

	});

	describe('lastEntry', function() {
		it('should return the last dummy entry',
		function(done) {
			db.getLastEntry(function(row) {
				assert.deepEqual(row, settings.testValues.tomorrow);
				done();
			});
		});
	});

});
