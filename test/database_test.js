var Database = require('./../database.js');
var settings = require('./../settings.js');
var assert = require('chai').assert;
var db = new Database();
settings.database_file = 'test_database.db';
var fs = require('fs');

describe("Database", function() {
	describe("insert", function() {
		it("Should add three rows", function(done) {
			db.init();
			db.insert({date: 1200, temperature: 20}, function(err) {
				assert.isNull(err, "Insert callback returns no error");
				db.insert({date: 1300, temperature: 21}, function(err) {
					assert.isNull(err, "Insert callbacl returns no error");
					db.insert({date: 1400, temperature: 22}, function(err) {
						assert.isNull(err, "Insert callbacl returns no error");
						done();
					});
				});
			});
		});
	});

	describe("get", function() {
		it("startDate 1200, endDate 1400 should return all 3 rows", function(done) {
			db.get(1200, 1400, function(rows) {
				assert.equal(rows.length, 3);
				assert.deepEqual(rows[0], {date:1200, temperature:20});
				assert.deepEqual(rows[1], {date:1300, temperature:21});
				assert.deepEqual(rows[2], {date:1400, temperature:22});
				done();
			});
		});

		it("should return {date:1200:, temperature:20}", function(done){
			db.get(1200, 1299, function(rows) {
				assert.equal(rows.length, 1);
				assert.deepEqual(rows[0], {date:1200, temperature:20});
				done();
			});
		});

		it("should return {date:1300:, temperature:21}", function(done){
			db.get(1300, 1399, function(rows) {
				assert.equal(rows.length, 1);
				assert.deepEqual(rows[0], {date:1300, temperature:21});
				done();
			});
		});

		it("should return {date:1400:, temperature:22}", function(done){
			db.get(1400, 1499, function(rows) {
				assert.equal(rows.length, 1);
				assert.deepEqual(rows[0], {date:1400, temperature:22});
				done();
			});
		});

	});

	describe("extremes", function() {
		it("should return all min and max temperature", function(done) {
			db.extremes(null, null, function(extremes) {
				assert.deepEqual(extremes,{
					min: {
						date:1200,
						temperature:20
					},
					max: {
						date:1400,
						temperature:22
					}
				});
				done();
			});
		});

		it("should return filtered min and max temperature", function(done) {
			db.extremes(1201, null, function(extremes) {
				assert.deepEqual(extremes, {
					min: {
						date:1300,
						temperature:21
					},
					max: {
						date:1400,
						temperature:22
					}
				});
				done();
			});
		});

		it("should return filtered min and max temperature", function(done) {
			db.extremes(null, 1399, function(extremes) {
				assert.deepEqual(extremes, {
					min: {
						date:1200,
						temperature:20
					},
					max: {
						date:1300,
						temperature:21
					}
				});
				done();
			});
		});

		it("should return filtered min and max temperature", function(done) {
			db.extremes(1201, 1399, function(extremes) {
				assert.deepEqual(extremes, {
					min: {
						date:1300,
						temperature:21
					},
					max: {
						date:1300,
						temperature:21
					}
				});
				done();
			});
		});

	});

	describe("lastEntry", function() {
		it("should return the last dummy entry", function(done) {
			db.getLastEntry(function(row) {
				assert.deepEqual(row, {date:1400, temperature:22});
				done();
			});
		});
	});

});
