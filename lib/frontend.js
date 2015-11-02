'use strict';

var winston = require('winston'),
    async = require('async'),
    conf = require('./config'),
    Analyze = require('./analyze');

function Frontend () { /* no-op */ }

Frontend.prototype.run = function (config, finishedCb) {
  //try {
    this.config = conf.setupDefaultValues(config);
  //}
  //catch(err) {
  //  return finishedCb(err);
  //}

  var self = this;

  async.series([
    function (cb) {
      self._setupLog(cb);
    }
  ], function (err) {
    if (err) { return finishedCb(err); }

    var analyze = new Analyze(config);
    analyze.run(finishedCb);
  });

};

Frontend.prototype._setupLog = function(cb) {
  var logLevel = this.config.verbose ? 'verbose' : 'info';

  if (process.env.NODE_ENV === 'test') {
    logLevel = 'error';
  }

  winston.loggers.add('frontend', {
    console: {
      level: logLevel,
      colorize: !this.config.noColor,
      silent: this.config.silent
    }
  });

  this.log = winston.loggers.get('frontend');
  cb();
};

module.exports = Frontend;
