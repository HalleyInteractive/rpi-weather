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
    db.getLastTemperatureEntry()
    .then((row) => {
      res.json(row);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });

  /**
  * Get all temperature readings from the last 24 hours
  */
  router.get('/24hours', (req, res) => {
    let now = new Date();
    db.getTemperature({
      dateStart: now.getTime() - MILLISECOND_IN_DAY,
      dateEnd: now.getTime()
    })
    .then((rows) => {
      res.json(rows);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });

  module.exports.router = router;
  module.exports.init = init;
}());
