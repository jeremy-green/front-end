'use strict';

var converters = require('../util/converters');

module.exports = {
  getUniqueConfigList: function getUniqueConfigList (configList) {
    var tmp = {};

    configList.forEach(function (item) {
      var arr = item.split(',');
      arr.forEach(function (i) {
        if (i.trim() === '') { return; }

        var key = converters.removeNonWordChars(i).toLowerCase();
        tmp[key] = 1;
      });
    });
    return Object.keys(tmp);
  },
  hasRuleset: function hasRuleset (ruleset) {
    return typeof ruleset !== 'undefined' && !!ruleset.length;
  },
  isEmptyObject: function isEmptyObject (obj) {
    var name;
    for (name in obj) {
      return false;
    }
    return true;
  }
};
