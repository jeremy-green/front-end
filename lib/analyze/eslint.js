'use strict';

var CLIEngine = require('eslint').CLIEngine,
    moment = require('moment'),
    winston = require('winston'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running eslint');

    var self = this,
        startTime = moment(),
        cli = new CLIEngine({
          configFile: ruleset
        });

    var report = cli.executeOnFiles(files);
    this.log.info('Finished eslint.');
    self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');
    cb(null, report);
  }
};
