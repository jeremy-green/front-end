'use strict';

var async = require('async'),
    lazy = require('lazy'),
    fs = require('fs-extra'),
    Checker = require('jscs'),
    winston = require('winston'),
    moment = require('moment'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running jscs');

    var self = this,
        startTime = moment(),
        jscs = {};

    async.eachSeries(
      files,
      function iterator (file, callback) {
        var checker = new Checker();
        checker.configure({
          preset: 'google',
          maxErrors: -1
        });

        jscs[file] = [];

        new lazy(fs.createReadStream(file))
            .on('end', function () {
              callback(null);
            })
            .lines
            .map(String)
            .forEach(function (line) {
              var results = checker.checkString(line);
              results.getErrorList().forEach(function (error) {
                jscs[file].push(error);
              });
            });
      },
      function done () {
        self.log.info('Finished jscs.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');
        cb(null, jscs);
      }
    );
  }
};
