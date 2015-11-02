'use strict';

var jshintcli = require('jshint/src/cli'),
    winston = require('winston'),
    moment = require('moment'),
    //utils = require('../util/utils'),
    fileHelper = require('../util/fileHelpers');

module.exports = {
  analyze: function analyze (files, ruleset, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running jshint');

    var self = this,
        startTime = moment(),
        hint = {};

    jshintcli.run({
      args: files,
      config: ruleset,
      //verbose: true,
      reporter: function (results, data, opts ) {
        self.log.info('Finished jshint.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');
        cb(null, results);
      }
    });
  }
};
