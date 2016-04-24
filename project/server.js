(function() {
  'use strict';

  const settings = require('./settings.js');
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  //const io = require('socket.io')(server);
  //const exphbs  = require('express-handlebars');
  const port = process.env.PORT || settings.SERVER_PORT;
  //let path = require('path');

  function init() {
    server.listen(port);
  }

  // Static routes
  app.use('/', express.static('static/'));

  /**
  * Main route that gets the current/last entry
  * /
  */
  /*
  app.get('/', (req, res) => {
    db.getLastTemperatureEntry()
    .then((temperatureRow) => {
      db.getLastHumidityEntry()
      .then((humidityRow) => {
        res.render('index', {
          temperature: temperatureRow.temperature,
          humidity: humidityRow.humidity,
          scale: '˚',
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send('Get humidity error');
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send('Get temperature error');
    });
  });
  */

  /**
  * Shows a chart of the last 24 hours
  * /chart
  */
  /*
  app.get('/chart', (req, res) => {
    let now = new Date();

    let queryDates = {
      dateStart: now.getTime() - settings.MILLISECONDS_IN_DAY,
      dateEnd: now.getTime(),
    };
    db.getTemperature(queryDates)
    .then((temperatureRows) => {
      db.getHumidity(queryDates)
      .then((humidityRows) => {
        res.render('chart', {
          'temperature': temperatureRows,
          'humidity': humidityRows,
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
  */

  /**
  * Public function to update all connected clients with a new readouts
  * @param {object} values Temperature and Humidity readout
  function update(values) {
    io.emit('update', values);
  }
  */

  // Make update publically available
  //module.exports.update = update;
  module.exports.init = init;
})();
