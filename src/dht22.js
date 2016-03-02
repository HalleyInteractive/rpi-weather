(function() {
  'use strict';

  let sensor = require('node-dht-sensor');
  let readout = {
    temperature: 0,
    humidity: 0
  };

  class DHT22 {

    constructor() {
      let initialised = sensor.initialize(22, 21);
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

    humidity() {
      return readout.humidity;
    }
  }
  module.exports = new DHT22();
})();
