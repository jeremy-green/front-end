'use strict';

var assert = require('chai').assert,
    util = require('../../lib/util/utils');

describe('utils', function() {

  describe('#isEmptyObject', function() {

    it('should return a boolean', function() {
      var result = util.isEmptyObject({
        some: 'property'
      });
      assert.isBoolean(result);

      result = util.isEmptyObject({});
      assert.isBoolean(result);
    });

    it('should be true if the object has no properties', function() {
      var result = util.isEmptyObject({});
      assert.strictEqual(result, true);
    });

    it('should be false if the object has properties', function() {
      var result = util.isEmptyObject({
        some: 'property'
      });
      assert.strictEqual(result, false);
    });

  });

  describe('#hasRuleset', function () {

    it('should return a boolean', function() {
      var result = util.hasRuleset('somePath');
      assert.isBoolean(result);

      result = util.hasRuleset('');
      assert.isBoolean(result);
    });

    it('should be true if the string is defined and has a length', function() {
      var result = util.hasRuleset('somePath');
      assert.strictEqual(result, true);
    });

    it('should be false if the string does not have a length', function() {
      var result = util.hasRuleset('');
      assert.strictEqual(result, false);
    });

    it('should be false if the string is not defined', function() {
      var result = util.hasRuleset();
      assert.strictEqual(result, false);
    });

  });

  describe('#getUniqueConfigList', function () {

    it('should return an array', function() {
      var result = util.getUniqueConfigList(['item']);
      assert.isArray(result);

      result = util.getUniqueConfigList(['item', 'item']);
      assert.isArray(result);
    });

    it('should have a length of 1', function() {
      var result = util.getUniqueConfigList(['item', 'item']);
      assert.lengthOf(result, 1);
    });

    it('should have a length of 2', function() {
      var result = util.getUniqueConfigList(['item', 'otherItem']);
      assert.lengthOf(result, 2);
    });

  });

});
