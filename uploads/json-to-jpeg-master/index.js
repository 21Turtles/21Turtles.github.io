/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

var CanvasConfig = require("./lib/canvasconfig.js");
var wordLengthUtils = require("./lib/wordlengthutils.js");


function canvasDriver (data) {
  var DataController = require("./lib/table-controller-v2");
  wordLengthUtils.columnCheck(data);
  var cconfig = new CanvasConfig();
  var dc = new DataController(data, cconfig.contextWrapper);
  return dc;
}




module.exports = canvasDriver;
