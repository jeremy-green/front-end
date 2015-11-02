'use strict';

var async = require('async'),
    moment = require('moment'),
    Parker = require('parker/lib/Parker'),
    metrics = require('parker/metrics/All'),
    winston = require('winston'),
    fileHelpers = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running parker');

    var self = this,
        startTime = moment(),
        parkerObj = {},
        parker = new Parker(metrics);

    async.each(
      files,
      function iterator (file, callback) {
        self.log.verbose('\u2192', file);

        fileHelpers.readFile(file, function (err, content) {
          parkerObj[file] = parker.run(content.toString());
          callback();
        });

      },
      function done (err) {
        self.log.info('Finished parker.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

        cb(err, parkerObj);
      }
    );
  }
};
