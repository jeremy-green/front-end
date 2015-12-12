'use strict';

var async = require('async'),
    moment = require('moment'),
    escomplex = require('escomplex-js'),
    walker = require('escomplex-ast-moz'),
    winston = require('winston'),
    fileHelpers = require('../util/fileHelpers'),
    converters = require('../util/converters');

module.exports = {
  analyze: function analyze (files, options, cb) {
    this.log = winston.loggers.get('frontend');
    this.log.info('Running complexity');

    var self = this,
        startTime = moment(),
        complexity = {};

    async.each(
      files,
      function iterator (file, callback) {
        fileHelpers.readFile(file, function (err, content) {
          complexity[file] = escomplex.analyse(content, walker, options);
          callback();
        });
      },
      function done (err) {
        self.log.info('Finished complexity.');
        self.log.verbose(moment().diff(startTime, 'seconds') + ' seconds.');

        cb(err, complexity);
      }
    );
  }
};
