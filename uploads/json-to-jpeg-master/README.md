# json-to-jpeg

This package allows you to convert a 2 dimensional JSON array into a jpeg image. 
Some potential uses:
- Including a table module for a text editor that doesn't support tables
- Displaying data to a user on your website

Soon, it will support converting csv and xsl files as well.


## Installation
```
npm install table-json-to-jpeg --save
```
Note: Depends on [Node Canvas](https://github.com/Automattic/node-canvas "Node Canvas") which depends Cairo and Pango. Head over to that repo, and follow the quick instruction for the easy install based on your OS.

## Usage
```javascript
 var TableToJpg = require("table-json-to-jpeg");

var data = [
	['col1', 'col2', 'col3'],
	['col1 row2', 'col2', 'col3'],
	['col1 row3', 'col2', 'col3']
];
new TableToJpg(data).printImage("outfile.jpg").then(() => {
    console.log("successfully created table")
  })
  .catch((e) => {
    console.log("error creating table " + e.message);
  });
```

Note: use Array of Rows, which = array of columns as input data. 

Also go into module directory and run 
```node main.js```
for more in deph tests