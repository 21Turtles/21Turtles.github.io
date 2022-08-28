/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package table-to-png
* 2017-08-24
*/
// Test Data
var testdata = require("../test-data.js");
var CanvasConfig = require("../../lib/canvasconfig.js");
// Controller
var TableController = new require("../../lib/table-controller-v2.js");


var assert = require("assert");
describe('TableController', function () {
  // get private methods
  function generateTestController (data) {
    tcdata = (data) ? data : testdata;
    tc =  new TableController(tcdata, CanvasConfig.contextWrapper);
    tc.__testing__.initializeValues();
    return tc;
  }
  function generateTestDataByRows (rows) {
    return {
      title : "",
      published : false,
      data : rows
    }
  }


  var tcontroller =generateTestController();
  describe("#getMinWord", function() {
    it ("should return the smallest word in an array", function () {
      var largestword = "hiiiiiiii";
      var word = tcontroller.__testing__.getMinWord(["hi", "hiiii", largestword], true);
      assert.equal(word, largestword);
    });
  });

  describe("#getMinWidths()", function() {

    it ("should pick the cell with more of the same letters if they are both the bold or both not bold", function () {
      var longerCell = "this ends here";
      var shorterCell = "this ends";
      var row1 = [{text : shorterCell, bold : false}];
      var row2 = [{text : longerCell, bold : false}];
      var dat = {
        title : "",
        published : false,
        data : [
          row1
          , // col1
          row2
        ]
      };
      var newTController = generateTestController(dat);
      newTController.__testing__.getMinWidths();
      assert.equal(JSON.stringify(newTController.colMaxRows[0]), JSON.stringify(row2[0]));
    });

    it ("should pick the cell that is bold if they both have the same letters otherwise", function() {
      var cell = "Howirjeofslo oj sdoifj sdf lkdf fskdl";
      var row1 = [{text : cell, bold : false}];
      var row2 = [{text : cell, bold : true}];
      var dat = generateTestDataByRows([row1, row2]);
      var newTController = generateTestController(dat);
      newTController.__testing__.getMinWidths();
      assert.equal(JSON.stringify(newTController.colMaxRows[0]), JSON.stringify(row2[0]));
    });
  });
  describe("getProportionalWidth", function () {
    it ("should return equal proportions for columns with equal width", function () {
      var word = "hello";
      var col = {text : word, bold : false};
      var testData = generateTestDataByRows(
        [[col, col]]
      )
      var tcontroller = generateTestController(testData);
      tcontroller.__testing__.getMinWidths();
      tcontroller.__testing__.getProportionalWidth();
      assert.equal(true, (tcontroller.colWidths[0]===tcontroller.colWidths[1]));
    });

    it ('should return a smaller proportion for a column that is not bold vs another that is, with the same text', function () {
      var words = ["hi", "hello", "goodbye", "yellho"];
      for (var i=0; i<words.length; i++) {
        var col1 = {text : words[i], bold : false};
        var col2 = {text : words[i], bold : true};
        var data = generateTestDataByRows([[col1, col2]]);
        var tcontroller = generateTestController(data);
        tcontroller.__testing__.getMinWidths();
        tcontroller.__testing__.getProportionalWidth();
        assert.equal(true, (tcontroller.colWidths[1] > tcontroller.colWidths[0]));
      }

    });
    it ("should not throw an error when running through test data", function () {
      var tcontroller =generateTestController();
      tcontroller.__testing__.getMinWidths();
      tcontroller.__testing__.getProportionalWidth();
    });
  });



});
