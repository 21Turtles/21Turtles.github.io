/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-08-24
*/


'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isNumber: function(arg) {
    return typeof(arg) === "number";
  },
  isArray: function(arg) {
    return (typeof(arg) === 'object' && arg.length != null && arg !== null);
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null && arg.length == null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};
