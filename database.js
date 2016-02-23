(function() {
  'use strict';
  let fs = require('fs');
  let sqlite3 = require('sqlite3').verbose();
  let settings = require('./settings.js');

  class Database {

    constructor() {
      this.insertStatement = null;
      this.selectSTatement = null;
      this.db = null;
    }

    init() {
      if (!global.db) {
        if (!fs.existsSync(settings.DATABASE_FILE)) {
          let err = fs.writeFileSync(settings.DATABASE_FILE, '', {
            flags: 'wx',
          });
          if (err) {
            console.log(err);
          }
        }
        global.db = new sqlite3.Database(settings.DATABASE_FILE);
      }
      this.db = global.db;
      this.createTable();
      this.insertStatement = this.db.prepare('INSERT INTO temperature (date, temperature) VALUES($date, $temperature)');
      this.selectStatement = this.db.prepare('SELECT date, temperature FROM temperature WHERE date >= $dateStart AND date <= $dateEnd');
    }

    createTable() {
      this.db.serialize(() => {
        this.db.run('CREATE TABLE IF NOT EXISTS temperature (date NUM, temperature NUM)');
      });
    }

    insert(data, callback) {
      this.insertStatement.run({
        $date: data.date,
        $temperature: data.temperature,
      }, function(err) {
        if (err) {
          console.log(err);
        }
        callback(err);
      });
    }

    get(dateStart, dateEnd, callback) {
      this.selectStatement.all({
        $dateStart: dateStart,
        $dateEnd: dateEnd,
      }, function(err, results) {
        if (err) {
          console.log(err);
        }
        callback(results);
      });
    }

    extremes(dateStart, dateEnd, callback) {
      let extremes = {
        min: {},
        max: {},
      };

      let filterQuery = dateStart || dateEnd ? ' WHERE' : '';
      if (dateStart) {
        filterQuery += ' date >= ' + dateStart.toString();
      }
      if (dateEnd) {
        if (dateStart) {
          filterQuery += ' AND';
        }
        filterQuery += ' date < ' + dateEnd.toString();
      }

      this.db.get('SELECT date, MIN(temperature) as temperature FROM temperature' + filterQuery, (err, row) => {
        if (err) {
          console.log(err);
        }
        extremes.min = row;
        this.db.get('SELECT date, MAX(temperature) as temperature FROM temperature' + filterQuery, (err, row) => {
          if (err) {
            console.log(err);
          }
          extremes.max = row;
          callback(extremes);
        });
      });
    }

    getLastEntry(callback) {
      this.db.get('SELECT date, temperature FROM temperature ORDER BY date DESC LIMIT 1', function(err, row) {
        if (err) {
          console.log(err);
        }
        callback(row);
      });
    }
  }

  module.exports = new Database();
}());
