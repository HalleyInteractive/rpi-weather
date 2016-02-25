(function() {
  'use strict';

  const router = require('express').Router();
  const db = require('./database.js');
  const MILLISECOND_IN_DAY = 60 * 60 * 24 * 1000;

  db.init();

  /**
  * Standard API route, returns last database entry
  */
  router.get('/', (req, res) => {
    db.getLastEntry((row) => {
      res.json(row);
    });
  });

  /**
  * Get temperatures in a range from start to end date
  * @param :startDate {int} Start date
  * @param :endDate {int} End date
  */
  router.get('/:startDate/:endDate', (req, res) => {
    db.get(req.params.startDate, req.params.endDate, (rows) => {
      res.json(rows);
    });
  });

  /**
  * Get max and min temperature recorded
  */
  router.get('/extremes', (req, res) => {
    db.extremes(null, null, (rows) => {
      res.json(rows);
    });
  });

  /**
  * Get extremes in a range from start to end date
  * @param :startDate {int} Start date
  * @param :endDate {int} End date
  */
  router.get('/extremes/:startDate/:endDate', (req, res) => {
    db.extremes(req.params.startDate, req.params.endDate, (rows) => {
      res.json(rows);
    });
  });

  /**
  * Get all temperature readings from today
  */
  router.get('/today', (req, res) => {
    let now = new Date();
    let millisecondsToday = ((now.getHours() * 60 * 60) +
    (now.getMinutes() * 60) + now.getSeconds()) * 1000;

    db.get(now.getTime() - millisecondsToday - 1000, now.getTime(), (rows) => {
      res.json(rows);
    });
  });

  /**
  * Get all temperature readings from this week
  */
  router.get('/week', (req, res) => {
    let now = new Date();
    let millisecondsToday = ((now.getHours() * 60 * 60) +
    (now.getMinutes() * 60) + now.getSeconds()) * 1000;

    db.get(now.getTime() - millisecondsToday - (MILLISECOND_IN_DAY * 6),
    now.getTime(), (rows) => {
      res.json(rows);
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

  module.exports = router;
}());
