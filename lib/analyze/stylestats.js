'use strict';

var async = require('async'),
    winston = require('winston'),
    moment = require('moment'),
    StyleStats = require('stylestats'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running stylestats');

    var self = this,
        startTime = moment(),
        firstFile = files[0],
        stats;

    if (files.length === 1) {
      stats = new StyleStats(firstFile, ruleset);
      stats.parse(function (error, result) {
        self.log.info('Finished stylestats. Took ' + moment().diff(startTime, 'seconds') + ' seconds.');

        cb(null, result);
      });
    } else {
      var dirname = fileHelper.getDirWithSlash(firstFile),
          stylestatsObj = {};

      stats = new StyleStats(dirname, ruleset);
      stats.parse(function (error, result) {
        self.log.info('Finished stylestats on all stylesheets.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

        self.log.info('Running stylestats on every stylesheet');

        // reset
        startTime = moment();

        stylestatsObj = handleStyleStats(result);
        stylestatsObj.allStylesheets = {};

        async.each(
          files,
          function iterator (file, callback) {
            stats = new StyleStats(file, ruleset);
            stats.parse(function (err, res) {
              if (res) {
                stylestatsObj.allStylesheets[file] = res;
              }
              callback();
            });
          },
          function done (err) {
            self.log.info('Finished stylestats on every stylesheet.');
            self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

            cb(err, stylestatsObj);
          }
        );
      });
    }

  }
};

var handleStyleStats = function handleStyleStats (result) {
  [
    'published',
    'paths',
    'mostIdentifierSelector',
    'lowestCohesionSelector',
    'uniqueFontSizes',
    'uniqueColors',
    'propertiesCount',
    'uniqueFontFamilies'
  ].forEach(function (prop) {
    delete result[prop];
  });

  return result;
};
