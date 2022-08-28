/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-08-24
*/

require("./utils/transpose.js")();
var fs = require("fs");

function TableController  (td, ctxWrapper)  {
  var self = this;
  this.tableRowArray = td.data; /* 2d array constituting table, array of rows */
  this.tableArray = td.data.transpose(); /* Array of columns */
  this.colMinWidths;/* Each column needs to conform to this size, the biggest word in the column */
  this.colMaxRows; /* The maximum sized row for each column, in terms of pixels */
  this.colWidths; /* Final widths allocated to each column */



  /**
   * number of textlines down the page the table is. For example a line that wraps two lines would
   * be one more textLine down the table
   * @type {Number}
   */
  var textLines = 0;
  // /**
  //  * The number of rows that have been drawn so far
  //  * @type {Number}
  //  */
  // var rowLines = 0;
  /**
   * The number of rows that have been rendered thus far
   * @type {Number}
   */
  var currentRow = 0;
  /**
   * the textline that a row starts on. Need to keep track of this for rows that wrap lines,
   * so next column can revert to this. Otherwise next column starts at the bottom textline of
   * previous Column
   * @type {Number}
   */
  var startingTextline;

  function initializeValues () {
    currentRow = 0;
    textLines = 0;
    self.colMinWidths = [];
    self.colMaxRows = [];
    self.colWidths = [];
  }

  /**
   * Goes row by row through the table, formatting and converting texxt to image
   * @return {void}
   */
  function writeRows () {
    initializeValues();
    getMinWidths();
    getProportionalWidth();
    for (var i=0; i<self.tableArray[0].length; i++) {

      var h = renderRow();
    }

    if (ctxWrapper.getCanvasHeight() !== h) {
      // console.log(ctxWrapper.getCanvasHeight() + " " + h);
      ctxWrapper.setCanvasHeight(h);
      writeRows();
    }
    // ctxWrapper.setCanvasHeight(700);
  }


  /**
   * Converts image to jpeg file, and crops it according to where the table ends
   * @return {void}
   */
  this.printImage = (fname) => {
    return new Promise(function(resolve, reject) {
      writeRows();
      var data = ctxWrapper.getCanvas().toDataURL().replace(/^data:image\/\w+;base64,/, "");
      var buf = new Buffer(data, 'base64');
      fs.writeFile(fname, buf, function (err, data) {
        if (err) reject(err);
        else resolve();
      });
    });


  }


  function renderRow () {
    // renders the next row of text
    // console.log(self.colWidths); return;
    var xOffset = 0; /*  x pos for this row */

    ctxWrapper.drawRowLine(textLines, currentRow);
    /* save the textline that this row is on */
    startingTextline = textLines;

    for (var i=0; i<self.tableArray.length; i++) {
      ctxWrapper.drawColLine(xOffset);
      var thisCell = self.tableArray[i][currentRow];
      // console.log("Row: " + currentRow + " startingTextLine: " + startingTextline + " text: " + thisCell.text);
      var thisWidth = ctxWrapper.getTextSize(thisCell.text, thisCell.bold).width;

      var maxWidth = self.colWidths[i];
      // console.log(thisWidth + " " + maxWidth);
      // return;
      if (maxWidth >= thisWidth) {
        // start at the point that will center the text
        // console.log("one line");
        var startX = (maxWidth - thisWidth) / 2 + xOffset;
        ctxWrapper.writeText(thisCell.text, startX, startingTextline, currentRow, thisCell.bold);
      }
      else {
        // this text is going to span multiple lines since it is wider than the cell allocated
        writeWrappedText(thisCell, xOffset, maxWidth);
      }
      xOffset += maxWidth;
    }
    currentRow +=1;
    textLines += 1;
    ctxWrapper.drawColLine(xOffset);

    return ctxWrapper.drawRowLine(textLines, currentRow);

  }
  /**
   * Writes text that will span multplie lines, but in the same cell
   * @param  {String} line           the cell text to write
   * @param  {number} startingXOffset the xposition that this cell starts at
   * @param  {number} endOfLine       the xposition where this cell ends
   * @return {void}
   */
  function writeWrappedText (line, startingXOffset, endOfLine) {
    /* Split words, and put them into an array (with the space after them) so we
    can write one by one */
    var words = line.text.split(" ");
    // console.log(words);
    var itr = 0; // iterate through the words array
    var currX = 0; // xpos relative to startingXOffset
    var rowWrapTextLine = startingTextline;
    while (itr < words.length) {
      var thisWord = words[itr] + " ";
      // console.log(thisWord + "|");
      /* See if the end offset of this word  */
      if (ctxWrapper.getTextSize(thisWord).width + currX >= endOfLine) {
        rowWrapTextLine += 1; // move down a line
        textLines = (rowWrapTextLine > textLines) ? rowWrapTextLine : textLines;
        currX = 0; // start the beginning x position over
      }

      ctxWrapper.writeText(thisWord, currX + startingXOffset, textLines, currentRow, line.bold);
      // ctxWrapper.getAdjustedLength
      currX += ctxWrapper.getAdjustedLength(thisWord).width;
      itr+=1;
    }
  }



  /**
   *  @description
   * Gets the longest single word, by length on canvas, for each column as well as the longest
   * overall cell for each column
   * @access private
   * @return {[type]} [description]
   */
  function getMinWidths () {
    var shortestWordsPerColumn = [];
    var longestCellsPerColumn = [];
    // iterate through columns. Get longest word in each column
    for (var i=0; i<self.tableArray.length; i++) {
      /*  Keep track of the biggest word from the column and its size */
      var colMaxWordWidth = 0; // max word width for this col
      var colLargestWord = null;
      var colMaxTotalWidth = 0;
      var colLargestCell = null;
      for (var j=0; j<self.tableArray[i].length; j++) {
        var thisCol = self.tableArray[i][j];
        var maxWord = getMinWord(thisCol.text.split(" "), thisCol.bold);
        // now we have maxword, add to shortestWordPerColumn
        if (ctxWrapper.getTextSize(maxWord, thisCol.bold).width > colMaxWordWidth) {
          colLargestWord = {text : maxWord, bold : thisCol.bold};
          colMaxWordWidth = ctxWrapper.getTextSize(maxWord, thisCol.bold).width;
        }
        if (ctxWrapper.getTextSize(thisCol.text, thisCol.bold).width > colMaxTotalWidth) {
          colLargestCell = thisCol;
          colMaxTotalWidth = ctxWrapper.getTextSize(thisCol.text, thisCol.bold).width;
        }
      }
      shortestWordsPerColumn.push(colLargestWord);
      longestCellsPerColumn.push(colLargestCell);
    }
    self.colMinWidths = shortestWordsPerColumn;
    self.colMaxRows = longestCellsPerColumn;
  }


  /**
   * TODO move to utility class
   * Calculates the smallest word in an array based on the ctx.getWordLength tool
   * @param  {Array} wordArray Array of words
   * @return {String}           the smallest word in the array
   */
  function getMinWord (wordArray, bold) {
    var minW = 0;
    var smallestWord = "";
    for (var i=0; i<wordArray.length; i++) {
      // get width of word
      var w = ctxWrapper.getTextSize(wordArray[i], bold).width;
      if (w > minW) {
        smallestWord = wordArray[i];
        minW = w;
      }
    }
    return smallestWord;
  }


  /**
   * Allocates minimum size per word, then donates rest based on proportion of max cell size in the column
   * @return {void} sets the colWidth Array
   */
  function getProportionalWidth () {
    // get max canvas width siz
    var cMaxWidth = ctxWrapper.getCanvasMaxWidth();
    var sumWidth = 0;
    // subtract minimum cell lengths, and add maximum cell lengths
    for (var i=0; i<self.colMinWidths.length; i++) {
      var maxMinWordLength = ctxWrapper.getTextSize(self.colMinWidths[i].text, self.colMinWidths[i].bold).width;
      sumWidth += ctxWrapper.getTextSize(self.colMaxRows[i].text, self.colMaxRows[i].bold).width;
      cMaxWidth -= maxMinWordLength;
      self.colWidths.push(maxMinWordLength);
    }
    // allocate rest of the length
    for (var i=0;i<self.colMinWidths.length; i++) {
      self.colWidths[i] += ((ctxWrapper.getTextSize(self.colMaxRows[i].text, self.colMaxRows[i].bold).width / sumWidth) * cMaxWidth);
    }
  }



  /* Begin testing */
  self.__testing__ = {};
  self.__testing__.initializeValues = initializeValues;
  self.__testing__.getMinWidths = getMinWidths;
  self.__testing__.getMinWord = getMinWord;
  self.__testing__.getProportionalWidth = getProportionalWidth;
  /* End testing */


}

module.exports = TableController;
