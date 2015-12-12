'use strict';

var path = require('path'),
    exec = require('child_process').exec,
    moment = require('moment'),
    async = require('async'),
    winston = require('winston'),
    YAML = require('yamljs'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running cloc');

    var self = this,
        cloc = {},
        startTime = moment();

    async.each(
      files,
      function iterator (file, callback) {
        exec('cloc ' + file + ' --yaml --quiet', {
          maxBuffer: 1024 * 1024 * 500,
          cwd: process.cwd(),
          env: process.env
        }, function (err, results) {
          var resultsObj = YAML.parse(results.trim());
          cloc[file] = resultsObj;
          callback();
        });
      },
      function done (err) {
        self.log.info('Finished cloc.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

        cb(err, cloc);
      }
    );
  }
};
