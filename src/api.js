(function() {
  'use strict';

  const router = require('express').Router();
  const db = require('./database.js');
  const MILLISECOND_IN_DAY = 60 * 60 * 24 * 1000;

  function init() {
    db.init();
  }

  /**
  * Standard API route, returns last database entry
  */
  router.get('/', (req, res) => {
    db.getLastEntry((row) => {
      res.json(row);
    });
  });

  /**
  * Get all temperature readings from the last 24 hours
  */
  router.get('/24hours', (req, res) => {
    let now = new Date();
    db.get(now.getTime() - MILLISECOND_IN_DAY, now.getTime(), (rows) => {
      res.json(rows);
    });
  });

  module.exports.router = router;
  module.exports.init = init;
}());
