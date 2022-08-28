/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-08-24
*/
var assert = require("assert");
require("../../lib/utils/transpose.js")();
var utilityTypes = require("../../lib/utils/types.js");

/**
 * quick convert to json for array comparisonss
 * @param  {Array} arr The array to stringify
 * @return {string}     stringified array
 */
function js (arr) {return JSON.stringify(arr);}

describe("Utils", function() {
  describe ("::Types", function () {
    it ("Should know an array is an array", function () {
      assert.equal(utilityTypes.isArray([]), true);
    });
    it ("Should know an object iss not an array", function () {
      assert.equal(utilityTypes.isArray({"hi" : 3}), false);
    });
    it ("Should know that a string is not an array", function () {
      assert.equal(utilityTypes.isArray("hello"), false);

    })
    it ("Should know that a number is not an array", function () {
      assert.equal(utilityTypes.isArray(89234), false);
    })

  });


  describe("Transpose", function() {
    it("should flip an array's rows and columns", function() {
      // Each ROW will be a sequence
      var arrayOfRows = [
        ["A", "B", "C"],
        [1, 2, 3],
        ["Do", "re", "mi"]
      ];


      var expectedReturn = [
        ["A", 1, "Do"],
        ["B", 2, "re"],
        ["C", 3, "mi"]
      ];

      assert.equal(js(arrayOfRows.transpose()), js(expectedReturn));


    });
  });

  describe("Array Comparison", function () {

    it ("should know two different arrays are not the same", function () {
      assert.notEqual(js(["4", "2", "3"]), js(["1", "2", "3"]));
    });
    it ("Should know two of the same array are the same", function () {
      assert.equal(js(["1", "2", "3"]), js(["1", "2", "3"]));
    });
    it ("Should know two arrays with different types are not the same", function () {
      assert.notEqual(js(["1", "2", "3"]), js([1, 2, 3]));
    });
  })
});
