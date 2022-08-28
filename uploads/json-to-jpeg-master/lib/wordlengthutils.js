/**
* @author Jack Considine <jackconsidine3@gmail.com>
* @package
* 2017-07-25
*/

/**
 * Makes sure that there are an equal number of rows in each column
 * @param  {Table} table Input table data
 * @return {[type]}       [description]
 */

module.exports.columnCheck = (table) => {
	var dat = table.data;
	var numRows;
	for (var i=0; i<dat.length; i++) {
		if (numRows && numRows !== dat[i].length) {
			throw new RangeError("Separate columns have different lengths. Column  number" + i);

		}
		numRows = dat[i].length;
	}

	// for (var colheader in dat) {
	// 	if (dat.hasOwnProperty(colheader)) {
	// 		if (numRows && numRows !== dat[colheader].length)
	// 			throw new RangeError("Separate columns have different lengths. Column " + colheader);
	// 		numRows = dat[colheader].length;
	// 	}
	// }
}
