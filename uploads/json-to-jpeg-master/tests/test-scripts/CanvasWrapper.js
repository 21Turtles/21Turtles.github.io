/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-08-24
*/

var assert = require("assert");

var contextWrapper = require("../../lib/canvasconfig").contextWrapper;

describe ("CanvasConfig", function() {
  it ("Should judge bolded text to be larger than normal text", function () {
    var testWords = [
      "Hi",
      "hello",
      "Howirjeofslo oj sdoifj sdf lkdf fskdl"
    ];
    for (var i=0; i<testWords.length; i++) {
      // console.log
      assert.equal(contextWrapper.getTextSize(testWords[i], false).width  < contextWrapper.getTextSize(testWords[i], true).width, true );
    }

  });
})
