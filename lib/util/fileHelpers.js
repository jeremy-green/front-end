'use strict';

var fs = require('fs'),
    path = require('path'),
    converters = require('./converters');

module.exports = {
  convertDot2Underscore: function convertDot2Underscore (filePath) {
    return converters.convert2Underscore(path.basename(filePath, path.extname(filePath)));
  },
  extractFiles: function extractFiles (filePath, fileExtension, cb) {
    var self = this;

    fs.stat(filePath, function (err, stats) {
      var files = [];

      if (err) { return cb(err, files); }

      if (stats.isFile() && self.isValidFile(filePath, fileExtension)) {
        files.push(path.resolve('./', path.relative('./',filePath)));
        cb(null, files);
      }

      if (stats.isDirectory()) {
        fs.readdir(filePath, function (err, filesInDir) {
          filesInDir.forEach(function (file) {
            var absFilePath = path.join(path.resolve('./', path.relative('./',filePath)), file);
            if (self.isValidFile(file, fileExtension)) {
              files.push(absFilePath);
            }
          });
          cb(err, files);
        });
      }

    });
  },
  getAllFiles: function getAllFiles (filesObj) {
    var files = [];
    Object.keys(filesObj).forEach(function (fileObj) {
      files = files.concat(filesObj[fileObj]);
    });
    return files;
  },
  getDirWithSlash: function getDirWithSlash (filePath) {
    return path.dirname(filePath) + '/';
  },
  isValidFile: function isValidFile (filePath, ext) {
    return path.extname(filePath) === ext;
  },
  readFile: function readFile (filePath, cb) {
    fs.readFile(filePath, function (err, data) {
      cb(err, data);
    });
  },
  readJSONFile: function readJSONFile (filePath, cb) {
    this.readFile(filePath, function readFileCallback (err, data) {
      if (err) { data = '{}'; }

      cb(err, JSON.parse(data));
    });
  }
};
