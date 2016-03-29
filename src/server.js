(function() {
  'use strict';

  const settings = require('./settings.js');
  const express = require('express');
  const app = express();
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  const exphbs  = require('express-handlebars');
  const api = require('./api.js');
  const db = require('./database.js');
  const port = process.env.PORT || settings.SERVER_PORT;

  function init() {
    db.init();
    api.init();
    server.listen(port);
  }

  app.use('/api', api.router);
  app.engine('handlebars', exphbs({ defaultLayout: 'index' }));
  app.set('view engine', 'handlebars');

  // Static routes
  app.use('/css', express.static('static/css'));

  /**
  * Main route that gets the current/last entry
  * /
  */
  app.get('/', (req, res) => {
    db.getLastTemperatureEntry()
    .then((temperatureRow) => {
      db.getLastHumidityEntry()
      .then((humidityRow) => {
        res.render('index', {
          temperature: temperatureRow.temperature,
          humidity: humidityRow.humidity,
          scale: '˚'
        });
      });
    });
  });

  /**
  * Shows a chart of the last 24 hours
  * /chart
  */
  app.get('/chart', (req, res) => {
    let now = new Date();
    let query = {
      startDate: now.getTime() - settings.MILLISECONDS_IN_DAY,
      endDate: now.getTime()
    };
    
    db.getTemperature(query,
    (temperatureRows) => {
      db.getHumidity(query)
      .then((humidityRows) => {
        res.render('chart', {
          'temperature': temperatureRows,
          'humidity': humidityRows,
        });
      });
    });
  });

  /**
  * Public function to update all connected clients with a new readouts
  * @param {object} values Temperature and Humidity readout
  */
  function update(values) {
    io.emit('update', values);
  }

  // Make update publically available
  module.exports.update = update;
  module.exports.init = init;
})();
