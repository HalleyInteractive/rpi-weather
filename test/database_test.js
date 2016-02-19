var db = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var fs = require('fs');

settings.DATABASE_FILE = 'test_database.db';

describe("Database", function() {
	describe("insert", function() {
		it("Should add three rows", function(done) {
			db.init();
			db.insert(settings.test_values.yesterday, function(err) {
				assert.isNull(err, "Insert callback returns no error");
				db.insert(settings.test_values.today, function(err) {
					assert.isNull(err, "Insert callback returns no error");
					db.insert(settings.test_values.tomorrow, function(err) {
						assert.isNull(err, "Insert callback returns no error");
						db.insert(settings.test_values.max, function(err) {
							assert.isNull(err, "Insert callback returns no error");
							db.insert(settings.test_values.min, function(err) {
								assert.isNull(err, "Insert callback returns no error");
								done();
							});
						});
					});
				});
			});
		});
	});

	describe("get", function() {
		it("yesterday, tomorrow should return all 5 rows", function(done) {
			db.get(settings.test_values.yesterday.date - 1,
				settings.test_values.tomorrow.date + 1, function(rows) {
				assert.equal(rows.length, 5);
				assert.deepEqual(rows[0],
					settings.test_values.yesterday, "Yesterdays date should come back");
				assert.deepEqual(rows[1],
					settings.test_values.today, "Todays date should come back");
				assert.deepEqual(rows[2],
					settings.test_values.tomorrow, "Tomorrows date should come back");
				assert.deepEqual(rows[3],
					settings.test_values.max, "Max value should come back");
				assert.deepEqual(rows[4],
					settings.test_values.min, "Min value should come back");
				done();
			});
		});

		it("should return yesterday", function(done){
			db.get(settings.test_values.yesterday.date,
				settings.test_values.yesterday.date,
				function(rows) {
					assert.equal(rows.length, 1);
					assert.deepEqual(rows[0], settings.test_values.yesterday);
					done();
				});
		});

		it("should return tomorrow", function(done){
			db.get(settings.test_values.tomorrow.date,
				settings.test_values.tomorrow.date + settings.MILLISECONDS_TODAY,
				function(rows) {
					assert.equal(rows.length, 1);
					assert.deepEqual(rows[0], settings.test_values.tomorrow);
					done();
				});
		});

	});

	describe("extremes", function() {
		it("should return all min and max temperature", function(done) {
			db.extremes(null, null, function(extremes) {
				assert.deepEqual(extremes,{
					min: settings.test_values.min,
					max: settings.test_values.max
				});
				done();
			});
		});

		it("should return filtered min and max temperature", function(done) {
			db.extremes(settings.test_values.tomorrow.date - 1, null,
				function(extremes) {
					assert.deepEqual(extremes, {
						min: settings.test_values.tomorrow,
						max: settings.test_values.tomorrow
					});
					done();
				});
		});

		it("should return filtered min and max temperature", function(done) {
			db.extremes(null, settings.test_values.yesterday.date + 1,
				function(extremes) {
					assert.deepEqual(extremes, {
						min: settings.test_values.yesterday,
						max: settings.test_values.yesterday
					});
					done();
				});
		});

	});

	describe("lastEntry", function() {
		it("should return the last dummy entry",
		function(done) {
			db.getLastEntry(function(row) {
				assert.deepEqual(row, settings.test_values.tomorrow);
				done();
			});
		});
	});

});
