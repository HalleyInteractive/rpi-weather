(function() {
  'use strict';

  let sensor = require('node-dht-sensor');
  let readout = {
    temperature: 0,
    humidity: 0
  };

  class DHT22 {

    constructor() {
      let initialised = sensor.initialize(22, 4);
      if(!initialised) {
        console.log('Failed to initialise sensor');
      }
    }

    read() {
      sensor.read();
    }

    temperature() {
      return readout.temperature;
    }

    himidity() {
      return readout.humidity;
    }
  }
  module.exports = new DHT22();
})();
