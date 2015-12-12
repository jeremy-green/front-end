'use strict';

var path = require('path'),
    winston = require('winston'),
    fs = require('fs-extra');

exports.task = function (result, config, cb) {
  this.log = winston.loggers.get('frontend');
  var self = this;

  if (config.storeResults) {
    self.log.info('Attempting to save the results...');

    // doesn't play well with `JSON.stringify`
    delete result.colorguard;

    fs.writeFile('result.json', JSON.stringify(result), function (err) {
      var method = 'info',
          msg = 'Finished saving the results.';

      if (err) {
        method = 'error';
        msg = err;
      }

      self.log[method](msg);
      cb(err);
    });
  } else {
    cb();
  }
};
