'use strict';

var assert = require('chai').assert,
    converters = require('../../lib/util/converters');

describe('converters', function() {

  describe('#removeNonWordChars', function() {

    it('should return a string', function() {
      var result = converters.removeNonWordChars('<anonymous_function>');
      assert.isString(result);
    });

    it('should only have word characters', function() {
      var result = converters.removeNonWordChars('<anonymous_function>');
      assert.strictEqual(result, 'anonymous_function');
    });

  });

  describe('#convert2Underscore', function () {

    it('should return a string', function() {
      var result = converters.convert2Underscore('some.file.name');
      assert.isString(result);
    });

    it('should convert periods to underscores', function() {
      var result = converters.convert2Underscore('some.file.name');
      assert.strictEqual(result, 'some_file_name');
    });

  });

});
