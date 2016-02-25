(function() {
  'use strict';

  let fs = require('fs');

  const TEMPERATURE_REGEX = new RegExp(/t=([0-9]+)/);
  const ONEWIRE_PATH = '/sys/bus/w1/devices/28-00047573c7ff/w1_slave';

  class Temperature {

    /**
    * getTemperatureValue
    * Checks data/string for a temperature value and returns that value
    * @param data {string} String of data from the onewire file
    * @return {string} temperature value
    **/
    getTemperatureValue(data) {
      if(TEMPERATURE_REGEX.test(data)) {
        let matches = data.match(TEMPERATURE_REGEX);
        if(matches.length > 1) {
          return matches[1];
        }
      }
      return undefined;
    }

    /**
    * getCelciusValue
    * Returns the celcius value for the given Fahrenheit input
    * @param {string} String representing a temperature in fahrenheit
    * @return {string} Celcius value
    **/
    getCelciusValue(value) {
      return this.roundHalf((Math.round(parseInt(value) / 100) / 10).toFixed(1));
    }

    /**
    * roundHalf
    * Rounds a given floating number to it's closes .5 value
    * @param num {float} Floating number
    * @return {float} Floating number rounded to closest .5 value
    **/
    roundHalf(num) {
      return Math.round(num * 2) / 2;
    }

    /**
    * readTemperature
    * Reads the temperature from a onewire file
    * @param {function}
    **/
    readTemperature(cb, path) {
      if(path === undefined) {
        path = ONEWIRE_PATH;
      }
      if(fs.existsSync(path)) {
        fs.readFile(path, 'utf8', (err, data) => {
          if(err) {
            throw err;
          }
          cb(this.getCelciusValue(this.getTemperatureValue(data)));
        });
      } else {
        throw new Error('Onewire file doesn\'t exist');
      }
    }
  }
  module.exports = new Temperature();
})();
