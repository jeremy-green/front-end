'use strict';

var async = require('async'),
    moment = require('moment'),
    lazy = require('lazy'),
    fs = require('fs-extra'),
    winston = require('winston'),
    fileHelper = require('../util/fileHelpers'),
    csslint = require('csslint').CSSLint;

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running csslint');

    var self = this,
        startTime = moment(),
        lint = {};

    async.eachSeries(
      files,
      function iterator (file, callback) {
        self.log.verbose('\u2192', file);

        var csslintObj = [];

        new lazy(fs.createReadStream(file))
            .on('end', function () {
              lint[file] = csslintObj;
              callback(null);
            })
            .lines
            .forEach(function (line) {
              csslintObj.push(csslint.verify(line.toString(), ruleset));
            });
      },
      function done () {
        self.log.info('Finished csslint.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');
        cb(null, lint);
      }
    );
  }
};
