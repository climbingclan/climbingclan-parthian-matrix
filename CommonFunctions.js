var server = '18.168.242.164';
var port = 3306;
var dbName = 'bitnami_wordpress';
var username = 'gsheets';
var password = 'eyai4yohF4uX8eeP7phoob';
var url = 'jdbc:mysql://'+server+':'+port+'/'+dbName;
var cc_location = "Parthian Climbing Manchester";

const colors = {
  lightRed: "#ffcccb",
  lightGreen: "#90ee90",
  lightYellow: "#ffd898",
  lightBlue: "#ADD8E6",
  grey: "#a9a9a9",
  pink: "#ff75d8",
  yellow: "#fad02c",
  white: "#FFFFFF"
};

function setupSheet(name) {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName(name);
  sheet.clearContents();
  sheet.clearFormats();
  return sheet;
}

function setupCell(name, range) {
  var spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getSheetByName(name);
  let cellValue = sheet.getRange(range).getValue();
  
  if (isNaN(cellValue) || cellValue === "") {
    // Rerun eventListing
    readEventListing();
    
    // Try again
    cellValue = sheet.getRange(range).getValue();
    
    if (isNaN(cellValue) || cellValue === "") {
      throw new Error("Invalid event selected - please try again");
    }
  }
  
  return cellValue;
}

function appendToSheet(sheet, results) {
  let metaData = results.getMetaData();
  let numCols = metaData.getColumnCount();
  const rows = [];

  // First row with column labels
  const colLabels = [];
  for (let col = 0; col < numCols; col++) {
    colLabels.push(metaData.getColumnLabel(col + 1));
  }
  rows.push(colLabels);

  // Remaining rows with results
  while (results.next()) {
    const row = [];
    for (let col = 0; col < numCols; col++) {
      row.push(results.getString(col + 1));
    }
    rows.push(row);
  }

  sheet.getRange(1, 1, rows.length, numCols).setValues(rows);

  // Set the font size of the rows with column labels to 14
  sheet.getRange(1, 1, 1, numCols).setFontSize(14);
  sheet.autoResizeColumns(1, numCols);
}

function getColumnRange(sheet, columnHeader) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(columnHeader) + 1;
  if (columnIndex === 0) {
    throw new Error(`Column '${columnHeader}' not found in the sheet.`);
  }
  return sheet.getRange(2, columnIndex, sheet.getLastRow() - 1, 1);
}

function setColoursFormat(sheet, columnHeader, search, colour) {
  let range = getColumnRange(sheet, columnHeader);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains(search)
    .setBackground(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setTextFormat(sheet, columnHeader, search, colour) {
  let range = getColumnRange(sheet, columnHeader);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains(search)
    .setFontColor(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setWrapped(sheet, columnHeader) {
  var range = getColumnRange(sheet, columnHeader);
  range.setWrap(true);
  sheet.setColumnWidth(range.getColumn(), 300); // Set column width to 300 pixels
}

function setColoursFormatLessThanOrEqualTo(sheet, columnHeader, search, colour) {
  search = Number(search);
  let range = getColumnRange(sheet, columnHeader);
  var rule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThanOrEqualTo(search)
    .setBackground(colour)
    .setRanges([range])
    .build();
  var rules = sheet.getConditionalFormatRules();
  rules.push(rule);
  sheet.setConditionalFormatRules(rules);
}

function setNumberFormat(sheet, columnHeader, format) {
  let range = getColumnRange(sheet, columnHeader);
  range.setNumberFormat(format);
}

function makeReport(stmt, reportConfig) {
  let cell = setupCell("Dashboard", "B5");
  let sheet = setupSheet(reportConfig.sheetName);

  var results = stmt.executeQuery(reportConfig.query.replace('${cell}', cell));

  appendToSheet(sheet, results);

  if (reportConfig.formatting) {
    reportConfig.formatting.forEach(format => {
      if (format.type === 'color') {
        setColoursFormat(sheet, format.column, format.search, format.color);
      } else if (format.type === 'text') {
        setTextFormat(sheet, format.column, format.search, format.color);
      } else if (format.type === 'wrap') {
        setWrapped(sheet, format.column);
      } else if (format.type === 'numberFormat') {
        setNumberFormat(sheet, format.column, format.format);
      } else if (format.type === 'colorLessThanOrEqual') {
        setColoursFormatLessThanOrEqualTo(sheet, format.column, format.value, format.color);
      } else if (format.type === 'columnWidth') {
        setColumnWidth(sheet, format.column, format.width);
      }
    });
  }

  results.close();
}

function setColumnWidth(sheet, columnHeader, width) {
  var range = getColumnRange(sheet, columnHeader);
  sheet.setColumnWidth(range.getColumn(), width);
}

function refreshOutput() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readOutput(stmt);
  stmt.close();
  conn.close();
}

function refreshStats() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readStats(stmt);
  stmt.close();
  conn.close();
}

function refreshLeadBelayTraining() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readLeadBelayTraining(stmt);
  stmt.close();
  conn.close();
}

function refreshTopRopeTraining() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readTopRopeTraining(stmt);
  stmt.close();
  conn.close();
}

function refreshEventListing() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();
  readEventListing(stmt);
  stmt.close();
  conn.close();
}
