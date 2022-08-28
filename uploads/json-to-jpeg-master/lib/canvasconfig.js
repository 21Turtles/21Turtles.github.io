/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-26
*/

const Canvas = require('canvas');
/* Configuration parameters */
const CANVAS_HEIGHT = 200;
const CANVAS_WIDTH = 1000;
const TEXT_PADDING = 16; // 4px
const TEXT_SIZE = 16;
const FONT_FAMILY = "Times";
var Image = Canvas.Image;
/**
 * Contains information for other library classes to use a singleton
 * configuration object
 * @type {CanvasConfig}
 */
function CanvasConfig () {
  this.canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  this.contextWrapper = new Context2dWrapper(this.canvas, TEXT_PADDING, TEXT_SIZE, FONT_FAMILY, CANVAS_WIDTH, CANVAS_HEIGHT);
}

module.exports = CanvasConfig;

/**
 *
 * @param       {Canvas} canvas           Canvas object for rendering images
 * @param       {Number} padding          [description]
 * @param       {[type]} textsize         [description]
 * @param       {[type]} font             [description]
 * @param       {[type]} constraintwidth  [description]
 * @param       {[type]} constraintHeight [description]
 * @constructor
 */
function Context2dWrapper (canvas, padding, textsize, font, constraintwidth, constraintHeight) {
  var ctx = canvas.getContext('2d');
  // console.log(constraintwidth);
  this.getCanvasMaxWidth = function() {return constraintwidth;}
  this.setCanvasHeight = function(h) {
    constraintHeight = h;
    canvas.height = h;
    // canvas.width = constraintwidth;
    // ctx = canvas.getContext('2d');
    // console.log(constraintwidth);
  }
  this.getCanvasHeight = function() {return constraintHeight;}

  this.padding = padding;

  this.getCanvas = () => {return canvas;}

  /**
   * Given a starting x and y, a string of text, and whether it's bold, applies this text to the image
   * @param  {string} text the text to draw on the canvas
   * @param  {number} x    starting x-coordinate
   * @param  {number} textLines    number of wrapped lines
   * @param  {number} rowLines     current row being written (of the table)
   * @param  {boolean} bold whether the text being written is bold or not
   * @return {void}
   */
  this.writeText = (text, x, textLines, rowLines, bold) => {
    // console.log(text);
    var y = getRowHeight(textLines, rowLines);
    ctx.font = getFontType(bold);
    ctx.fillText(text,  x + padding, y + padding );
  }

  /**
   * Returns the Y offset of a row which is a product of the row and the height of each row
   * @param  {number} rowNum number row from the top
   * @return {number} y offset
   */
  function getRowHeight (cartesianRow, tableRow) {
    if (cartesianRow + tableRow === 0) return padding;
    return tableRow * (padding * 2) + (cartesianRow) * ((textsize + padding/2 )) ;
  }


  /**
   * Uses 2d context function to
   * @param  {[type]} text [description]
   * @return {[type]}      [description]
   */
  this.getTextSize = (text, bold) => {
    ctx.font= getFontType(bold);
    var rawMeasure = ctx.measureText(text);
    rawMeasure.width += padding * 2; // apply padding on both sides
    return rawMeasure;
  }

  /**
   * Returns the length a string will take up relative to the start of a cell. This means
   * padding will only be applied once (the beginning of the cell)
   * @param  {string} text the string to get the length of
   * @param  {boolean} bold whether or not this string is bold
   * @return {ctx.measures}      the context measure meant of width
   */
  this.getAdjustedLength = function (text, bold) {
    ctx.font = getFontType(bold);
    var rawMeasure = ctx.measureText(text);
    // rawMeasure.width += padding;
    return rawMeasure;
  }

  /**
   * Draws a horizontal line after calculating the Y to draw it at.
   * @param  {integer} textLines Number of textlines down
   * @param  {integer} rowLines  number of rowlines down
   * @return {void}
   */
  this.drawRowLine = function (textLines, rowLines) {

    var yVal = getRowHeight(textLines, rowLines);//tableRow * (padding * 2) + (cartesianRow) *(textsize);
    writeLine(0, yVal - padding, constraintwidth, yVal - padding);
    return yVal - padding;
  }



  /**
   * Draws a column line (vertical) from the top of the canvas to the bottom, at a certain x position
   * @param  {number} xpos the xposition that the line should be drawn through
   * @return {void}
   */
  this.drawColLine = function (xpos) {
    xpos += padding;
    writeLine(xpos - padding, 0, xpos - padding, constraintHeight);
    // console.log(constraintHeight);
  }

  /**
   * Simply draws a line from one set of cartesian points to another, on the canvas
   * @param  {number} x1 Starting x
   * @param  {number} y1 Starting y
   * @param  {number} x2 ending x
   * @param  {number} y2 ending y
   * @return {void}
   */
  function writeLine (x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }



  /**
   * Helper function for returning context font based on whether text is bold or not
   * @access private
   * @param  {Boolean} isBold whether or not the font is bold
   * @return {string}        the font string
   */
  function getFontType(isBold) {
    if (isBold) return "bold " + textsize + "pt " + font;
    else return textsize + "pt " + font;
  }
}
