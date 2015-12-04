'use strict';

var async = require('async'),
    moment = require('moment'),
    colorguard = require('colorguard'),
    winston = require('winston'),
    fileHelpers = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running colorguard');

    var self = this,
        startTime = moment(),
        guard = {};

    async.each(
      files,
      function iterator (file, callback) {
        self.log.verbose('\u2192', file);

        fileHelpers.readFile(file, function (err, content) {
          colorguard
            .process(content /*, [options]*/)
            .then(function (result) {
              //console.log('Warnings', result.warnings().length);
              guard[file] = result;
              callback();
            });
        });

      },
      function done (err) {
        self.log.info('Finished colorguard.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

        cb(err, guard);
      }
    );
  }
};
