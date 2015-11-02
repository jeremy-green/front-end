'use strict';

var path = require('path'),
    exec = require('child_process').exec,
    moment = require('moment'),
    //async = require('async'),
    winston = require('winston'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running scsslint');

    var self = this,
        startTime = moment(),
        dir = path.dirname(files[0]);

    var config = '';
    if (ruleset.length) {
      config = ' --config=' + ruleset;
    }
    exec('scss-lint ' + dir + ' --format=JSON' + config, {
      maxBuffer: 1024 * 1024 * 500,
      cwd: process.cwd(),
      env: process.env
    }, function (err, results /*, code*/ ) {
      /**
       * @todo test
       */
      if (err && err.code !== 1 && err.code !== 2 && err.code !== 65) {
        if (err.code === 127) {
          this.log.error('1. Please make sure you have ruby installed: `ruby -v`');
          this.log.error('2. Install the `scss-lint` gem by running:');
          this.log.error('gem update --system && gem install scss-lint');
        } else {
          this.log.error('scss-lint failed with error code: ' + err.code);
          this.log.error('and the following message:' + err);
        }
        return cb(null, {});
      }

      var jsonResults = JSON.parse(results),
          files = Object.keys(jsonResults),
          lint = {};

      files.forEach(function(file) {
        self.log.verbose('\u2192', file);

        var result = jsonResults[file];
        lint[file] = result;
      });

      self.log.info('Finished scsslint.');
      self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

      cb(null, lint);
    });
  }
};
