'use strict';

var winston = require('winston'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    moment = require('moment'),
    Analyzer = require('./analyze/analyzer'),
    fileHelper = require('./util/fileHelpers');

function Analyze (config) {
  this.config = config;
  this.analyzer = new Analyzer();
  this.log = winston.loggers.get('frontend');
}

Analyze.prototype.run = function run (callback) {
  var self = this,
      startTime = moment();

  async.waterfall([
    function (cb) {
      self._getSeries(cb);
    },
    function (series, cb) {
      self._analyze(series, cb);
    },
    function (results, cb) {
      self._runPostTasks(results, cb);
    }
  ], function (err) {
    if (err) { return callback(err); }

    var now = moment();
    self.log.info('All done. Took ' + now.diff(/*config.*/startTime, 'seconds') + ' seconds.');
    callback(err);
  });

};

Analyze.prototype._getPostTasks = function (result) {
  var self = this;

  // lets read all post tasks
  var postTasks = [];
  var rootPath = path.join(__dirname, 'postTasks', path.sep);
  fs.readdirSync(rootPath).forEach(function(file) {
    postTasks.push(function (cb) {
      require(rootPath + file).task(result, self.config, cb);
    });
  });

  return postTasks;
};

Analyze.prototype._runPostTasks = function (result, callback) {
  var self = this,
      postTasks = this._getPostTasks(result);

  async.parallel(postTasks, function (err) {
    //if (!err) {
    //  self.log.log('info', 'Wrote results to ' + self.config.run.absResultDir);
    //} else {
    //  self.log.log('error', 'Couldn\'t create output:' + err);
    //}
    // yes we are finished!
    callback(err);
  });
};

Analyze.prototype._analyze = function (series, cb) {
  var self = this;

  async.series(series, function (err, res) {
    if (err) { self.log.error(err); }

    self.analyzer.analyze(res, self.config, cb);
  });
};

Analyze.prototype._getSeries = function (callback) {
  var series = {};

  if (this.config.js) {
    var jsPath = this.config.js[0];
    series.jsFiles = function (cb) {
      fileHelper.extractFiles(jsPath, '.js', cb);
    };
  }

  if (this.config.css) {
    var cssPath = this.config.css[0];
    series.cssFiles = function (cb) {
      fileHelper.extractFiles(cssPath, '.css', cb);
    };
  }

  if (this.config.scss) {
    var scssPath = this.config.scss[0];
    series.scssFiles = function (cb) {
      fileHelper.extractFiles(scssPath, '.scss', cb);
    };
  }

  callback(null, series);
};

module.exports = Analyze;
