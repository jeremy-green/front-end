'use strict';

var async = require('async'),
    winston = require('winston'),
    converters = require('../util/converters'),
    fileHelper = require('../util/fileHelpers');

function GraphiteCollector (config) {
  this.config = config;
  this.namespace = this.config.graphiteNamespace;
  this.log = winston.loggers.get('frontend');
}

GraphiteCollector.prototype.collect = function (results, cb) {
  var self = this,
      prefix = '_format',
      activeProfilers = self.config.activeProfilers,
      funcObj = {};

  self.log.verbose('Collecting data to send to Graphite.');

  // lets mutate some data!!
  activeProfilers.forEach(function (profiler) {
    funcObj[profiler] = function (callback) {
      // hack
      if (typeof self[prefix + profiler] === 'function') {
        self[prefix + profiler].call(self, results[profiler], callback);
      }
    };
  });

  async.parallel(funcObj, function (err, res) {
    cb(err, res);
  });

};

GraphiteCollector.prototype._formatcloc = function (cloc, cb) {
  var c = {
    total: 0
  };
  Object.keys(cloc).forEach(function (file) {
    if (cloc[file]) {
      var numLines = cloc[file].header.n_lines
      c.total += numLines;

      // we want to dynamically get the language
      // we're done with these props so delete them
      delete cloc[file].header;
      delete cloc[file].SUM;

      var type = Object.keys(cloc[file])[0],
          ltype = type.toLowerCase();

      if (!c[ltype]) {
        c[ltype] = {
          total:   0,
          blank:   0,
          comment: 0,
          code:    0
        };
      }
      c[ltype].total += numLines;
      c[ltype].blank += cloc[file][type].blank;
      c[ltype].comment += cloc[file][type].comment;
      c[ltype].code += cloc[file][type].code;

      // we also don't need `nFiles` since it's always 1
      delete cloc[file][type].nFiles;

      // but we'll add the total just in case
      cloc[file][type].total = numLines;
      c[ltype][fileHelper.convertDot2Underscore(file)] = cloc[file][type];
    }
  });
  cb(null, c);
};

GraphiteCollector.prototype._formatcolorguard = function (colorguard, cb) {
  var self = this,
      guard = {
        total: 0
      };

  Object.keys(colorguard).forEach(function (file) {
    var len = colorguard[file].warnings().length;
    guard.total += len;
    guard[fileHelper.convertDot2Underscore(file)] = len;
  });

  cb(null, guard);
};

GraphiteCollector.prototype._formatparker = function (parker, cb) {
  var self = this;
  Object.keys(parker).forEach(function (file) {
    var key = fileHelper.convertDot2Underscore(file);
    parker[key] = self._handleParker(parker[file]);
    delete parker[file];
  });

  cb(null, parker);
};

GraphiteCollector.prototype._handleParker = function (p) {
  [
    'media-queries',
    'top-selector-specificity-selector',
    'unique-colours'
  ].forEach(function (prop) {
    delete p[prop];
  });

  return p;
};

GraphiteCollector.prototype._formatscsslint = function (scsslint, cb) {
  var self = this,
      lint = {
        total: 0,
        warning: 0,
        error: 0
      };

  Object.keys(scsslint).forEach(function (file) {
    var result = scsslint[file];

    lint.total += result.length;
    lint[fileHelper.convertDot2Underscore(file)] = {
      total: result.length,
      warning: 0,
      error: 0
    };

    result.forEach(function (r) {
      lint[fileHelper.convertDot2Underscore(file)][r.severity] += 1;
      lint[r.severity] += 1;
    });

  });

  cb(null, lint);
};

GraphiteCollector.prototype._formatstylestats = function (stats, cb) {
  var self = this,
      styleStats = self._handleStyleStats(stats);

  if (styleStats.allStylesheets) {
    Object.keys(styleStats.allStylesheets).forEach(function (file) {
      var key = fileHelper.convertDot2Underscore(file);
      styleStats.allStylesheets[key] = self._handleStyleStats(styleStats.allStylesheets[file]);
      delete styleStats.allStylesheets[file];
    });
  }
  cb(null, styleStats);
};

GraphiteCollector.prototype._handleStyleStats = function (stat) {
  [
    'published',
    'paths',
    'mostIdentifierSelector',
    'lowestCohesionSelector',
    'uniqueFontSizes',
    'uniqueColors',
    'propertiesCount',
    'uniqueFontFamilies'
  ].forEach(function(prop) {
    delete stat[prop];
  });

  return stat;
};

GraphiteCollector.prototype._formateslint = function (eslint, cb) {
  var self = this,
      lint = {};

  lint.total = eslint.errorCount + eslint.warningCount;
  lint.error = eslint.errorCount;
  lint.warning = eslint.warningCount;

  eslint.results.forEach(function (result) {
    var file = fileHelper.convertDot2Underscore(result.filePath);

    lint[file] = {
      total: (result.errorCount + result.warningCount),
      error: result.errorCount,
      warning: result.warningCount
    };
  });

  cb(null, lint);
};

GraphiteCollector.prototype._formatcomplexity = function (complexityResults, cb) {
  var complexity = {};

  Object.keys(complexityResults).forEach(function (file) {
    var complexityResult = complexityResults[file],
        anonCounter = 0,
        funcs = {},
        funcName = '';

    complexityResult.functions.forEach(function (func) {
      funcName = func.name;
      funcName = converters.convert2Underscore(funcName);
      funcName = converters.removeNonWordChars(funcName);
      if (funcName === 'anonymous') {
        funcName = funcName + '_' + anonCounter;
        anonCounter++;
      }

      // remove name
      delete func.name;

      // remove operators and operands identifiers
      delete func.halstead.operators.identifiers;
      delete func.halstead.operands.identifiers;

      funcs[funcName] = func;
    });

    complexityResult.functions = funcs;

    // remove operators and operands identifiers
    delete complexityResult.aggregate.halstead.operators.identifiers;
    delete complexityResult.aggregate.halstead.operands.identifiers;

    // remove dependencies array
    delete complexityResult.dependencies;

    var key = fileHelper.convertDot2Underscore(file);
    complexity[key] = complexityResult;
  });

  cb(null, complexity);
};

GraphiteCollector.prototype._formatcsslint = function (csslint, cb) {
  var self = this,
      lint = { total: 0 };

  Object.keys(csslint).forEach(function (file) {
    var csslintObj = {
      total: 0,
      error: 0,
      warning: 0
    };

    var lintArr = csslint[file];
    lintArr.forEach(function (l) {
      var messages = l.messages;
      messages.forEach(function (message) {
        csslintObj[message.type] += 1;
        csslintObj.total += 1;
      });
    });

    lint.total += csslintObj.total;
    lint[fileHelper.convertDot2Underscore(file)] = csslintObj;
  });

  cb(null, lint);
};

GraphiteCollector.prototype._formatjshint = function (jshint, cb) {
  var self = this,
      hint = {};

  hint.total = jshint.length;

  jshint.forEach(function (r) {
    var file = fileHelper.convertDot2Underscore(r.file),
        error = r.error;

    if (hint[file]) {
      hint[file].total += 1;
    } else {
      hint[file] = {
        total: 1,
        percentScanned: 100
      };
    }

    if (error.reason.indexOf('Too many errors.') > -1) {
      var pct = error.reason.match(/\d+/);
      hint[file].percentScanned = parseInt(pct[0], 10);
    }

  });
  cb(null, hint);
};

module.exports = GraphiteCollector;
