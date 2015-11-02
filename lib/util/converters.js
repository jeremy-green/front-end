'use strict';

module.exports = {
  removeNonWordChars: function removeNonWordChars (name) {
    return name.replace(/\W+/g, '');
  },
  convert2Underscore: function convert2Underscore (name) {
    return name.replace(/\./g, '_');
  }
};
