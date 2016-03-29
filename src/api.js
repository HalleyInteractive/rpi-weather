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
    .then((temperatureRow) => {
      db.getLastHumidityEntry()
      .then((humidityRow) => {
        res.json({
          temperature: temperatureRow,
          humidity: humidityRow,
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
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
    let queryDates = {
      dateStart: now.getTime() - MILLISECOND_IN_DAY,
      dateEnd: now.getTime(),
    };

    db.getTemperature(queryDates)
    .then((temperatureRows) => {
      db.getHumidity(queryDates)
      .then((humidityRows) => {
        res.json({
          temperature: temperatureRows,
          humidity: humidityRows,
        });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });

  module.exports.router = router;
  module.exports.init = init;
}());
