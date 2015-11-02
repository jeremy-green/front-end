'use strict';

var defaultConfig = require('../conf/defaultConfig');

module.exports = {
  setupDefaultValues: function setupDefaultValues (config) {
    if (config.includeProfiler) {
      config.includeProfiler = config.includeProfiler.concat(defaultConfig.includeProfiler);
    }

    Object.keys(defaultConfig).forEach(function defaultConfigCallback (key) {
      if (!config.hasOwnProperty(key)) {
        config[key] = defaultConfig[key];
      }
    });

    //config.startTime = moment();
    return config;
  }
}
