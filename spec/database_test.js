var Database = require('./../database.js');
var db = new Database();
var fs = require('fs');
var test_database = 'test.db';


describe("Database", function() {
	describe("preInit", function() {
		it("should not have a test database file", function(done) {
			var dbexists = fs.existsSync(test_database);
			expect(dbexists).toBe(false);
			done();
		});

		it("should have created a database file", function(done) {
			db.databasefile = test_database;
			db.init();
			var dbexists = fs.existsSync(test_database);
			expect(dbexists).toBe(true);
			done();
		});

		it("should not have any rows", function(done) {
			db.get(0, 99999999999, function(rows) {
				expect(rows.length).toBe(0);
				done();
			});
		});
	});

	describe("insert", function() {
		it("Should add three row", function(done) {
			db.insert({date: 1200, temperature: 20}, function() {
				db.insert({date: 1300, temperature: 21}, function() {
					db.insert({date: 1400, temperature: 22}, function() {
						done();
					});
				});
			});
		});
	});

	describe("get", function() {
		it("startDate 1200, endDate 1400 should return all 3 rows", function(done) {
			db.get(1200, 1400, function(rows) {
				expect(rows.length).toBe(3);
				expect(rows[0]).toEqual({date:1200, temperature:20});
				expect(rows[1]).toEqual({date:1300, temperature:21});
				expect(rows[2]).toEqual({date:1400, temperature:22});
				done();
			});
		});

		it("should return {date:1200:, temperature:20}", function(done){
			db.get(1200, 1299, function(rows) {
				expect(rows.length).toBe(1);
				expect(rows[0]).toEqual({date:1200, temperature:20});
				done();
			});
		});

		it("should return {date:1300:, temperature:21}", function(done){
			db.get(1300, 1399, function(rows) {
				expect(rows.length).toBe(1);
				expect(rows[0]).toEqual({date:1300, temperature:21});
				done();
			});
		});

		it("should return {date:1400:, temperature:22}", function(done){
			db.get(1400, 1499, function(rows) {
				expect(rows.length).toBe(1);
				expect(rows[0]).toEqual({date:1400, temperature:22});
				done();
			});
		});

	});

	describe("lastEntry", function() {
		it("should return the last dummy entry", function(done) {
			db.getLastEntry(function(row) {
				expect(row).toEqual({date:1400, temperature:22});
				done();
			})
		});
	});

	describe("teardown", function() {
		it("should have removed it's test database file", function(done) {
			fs.unlinkSync(test_database);
			var dbexists = fs.existsSync(test_database);
			expect(dbexists).toBe(false);
			done();
		});
	});

});
