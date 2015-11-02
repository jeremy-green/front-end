'use strict';

var nomnom = require('nomnom');

var cli = nomnom.help('blah blah').options({
  js: {
    metavar: '<PATH>',
    list: true,
    help: 'js'
  },
  css: {
    metavar: '<PATH>',
    list: true,
    help: 'css'
  },
  scss: {
    metavar: '<PATH>',
    list: true,
    help: 'scss'
  },
  jshintrc: {
    metavar: '<PATH>',
    //list: true,
    help: 'jshintrc'
  },
  csslintrc: {
    metavar: '<PATH>',
    //list: true,
    help: 'csslintrc'
  },
  stylestatsrc: {
    metavar: '<PATH>',
    //list: true,
    help: 'stylestatsrc'
  },
  scsslintconfig: {
    metavar: '<PATH>',
    //list: true,
    help: 'scsslintconfig'
  },
  includeProfiler: {
    //abbr: 'ep',
    metavar: '<profiler1,profiler2>',
    list: true,
    help: 'A comma separated list of profilers to include.'
  },
  excludeProfiler: {
    //abbr: 'ep',
    metavar: '<profiler1,profiler2>',
    list: true,
    help: 'A comma separated list of profilers to exclude.'
  },
  excludeJs: {
    //abbr: 'ejs',
    metavar: '<PATH>',
    list: true,
    help: 'Javascript files to exclude.'
  },
  excludeCss: {
    //abbr: 'ecss',
    metavar: '<PATH>',
    list: true,
    help: 'CSS files to exclude.'
  },
  verbose: {
    abbr: 'v',
    default: false,
    flag: true,
    help: 'Enable verbose logging.'
  },
  noColor: {
    flag: true,
    default: false,
    help: 'Don\'t use colors in console output.'
  },
  noGraphite: {
    flag: true,
    default: false,
    help: 'Don\'t use Graphite.'
  }
}).parse();

module.exports = cli;
