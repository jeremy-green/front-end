'use strict';

var async = require('async'),
    complexity = require('./complexity'),
    csslint = require('./csslint'),
    eslint = require('./eslint'),
    jshint = require('./jshint'),
    jscs = require('./jscs'),
    cloc = require('./cloc'),
    parker = require('./parker'),
    scsslint = require('./scss-lint'),
    stylestats = require('./stylestats'),
    colorguard = require('./colorguard'),
    winston = require('winston'),
    utils = require('../util/utils'),
    fileHelper = require('../util/fileHelpers');

function Analyzer () { /* no-op */ }

Analyzer.prototype.analyze = function(filesObj, config, completionCallback) {
  var self = this,
      analyzerSeries = {};

  this.log = winston.loggers.get('frontend');

  if (filesObj.jsFiles) {
    analyzerSeries.eslint = function (cb) {
      var eslintrc = config.eslintrc || '';
      eslint.analyze(filesObj.jsFiles, eslintrc, cb);
    };

    analyzerSeries.jshint = function (cb) {
      var jshintrc = config.jshintrc;
      if (utils.hasRuleset(jshintrc)) {
        fileHelper.readJSONFile(jshintrc, function (err, data) {
          if (err) { self.log.error(err); }

          var ruleset = data;
          jshint.analyze(filesObj.jsFiles, ruleset, cb);
        });
      } else {
        jshint.analyze(filesObj.jsFiles, {}, cb);
      }
    };

    analyzerSeries.complexity = function (cb) {
      var complexityrc = config.complexityrc;
      if (utils.hasRuleset(complexityrc)) {
        fileHelper.readJSONFile(complexityrc, function (err, data) {
          if (err) { self.log.error(err); }

          var ruleset = data;
          complexity.analyze(filesObj.jsFiles, ruleset, cb);
        });
      } else {
        complexity.analyze(filesObj.jsFiles, {}, cb);
      }
    };

    analyzerSeries.jscs = function (cb) {
      //var eslintrc = config.eslintrc || '';
      jscs.analyze(filesObj.jsFiles, '', cb);
    };

  }

  if (filesObj.cssFiles) {
    analyzerSeries.csslint = function (cb) {
      var csslintrc = config.csslintrc || '';
      csslint.analyze(filesObj.cssFiles, csslintrc, cb);
    };

    analyzerSeries.stylestats = function (cb) {
      var stylestatsrc = config.stylestatsrc || '';
      stylestats.analyze(filesObj.cssFiles, stylestatsrc, cb);
    };

    analyzerSeries.parker = function (cb) {
      parker.analyze(filesObj.cssFiles, '', cb);
    };

    analyzerSeries.colorguard = function (cb) {
      colorguard.analyze(filesObj.cssFiles, '', cb);
    };
  }

  if (filesObj.scssFiles) {
    analyzerSeries.scsslint = function (cb) {
      var scsslintconfig = config.scsslintconfig || '';
      scsslint.analyze(filesObj.scssFiles, scsslintconfig, cb);
    };
  }

  analyzerSeries.cloc = function (cb) {
    cloc.analyze(fileHelper.getAllFiles(filesObj), cb);
  };

  if (config.includeProfiler) {
    var includedProfilers = utils.getUniqueConfigList(config.includeProfiler);
    Object.keys(analyzerSeries).forEach(function (profiler) {
      if (includedProfilers.indexOf(profiler) === -1) {
        delete analyzerSeries[profiler];
      }
    });
  }

  if (config.excludeProfiler) {
    var excludedProfilers = utils.getUniqueConfigList(config.excludeProfiler);
    excludedProfilers.forEach(function (profiler) {
      delete analyzerSeries[profiler];
    });
  }

  // for use later in life
  config.activeProfilers = Object.keys(analyzerSeries);

  async.series(
    analyzerSeries,
    function (err, res) {
      completionCallback(err, res);
    }
  );

};

module.exports = Analyzer;
