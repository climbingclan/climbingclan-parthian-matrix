function volunteerIntent() {
var conn = Jdbc.getConnection(url, username, password);
var stmt = conn.createStatement();

var spreadsheet = SpreadsheetApp.getActive();
let dashboard = spreadsheet.getSheetByName('Dashboard');
var cell = dashboard.getRange('B5').getValues();
cell = (cell === "" || cell === null || cell === "#N/A") ? 18794 : cell;

 var results = stmt.executeQuery('select distinct `first_name` "Name",`nickname` "fbname",admin_parthian_clan_join_admin_team "volunteer?",  CAST(`stats_volunteer_for_numerator_cached` AS UNSIGNED INTEGER) "Volunteering",`scores_volunteer_score_cached` "Receptiveness",scores_volunteer_reliability_score_cached "V Reliability%",stats_attendance_indoor_wednesday_attended_cached "attended indoors",scores_attendance_reliability_score_cached "Attendance %",`skills-belaying` "Belaying Skills",`climbing-indoors-skills-passing-on` "Skills passing on",cc_compliance_last_date_of_climbing "last climbed" from wp_member_db db where admin_parthian_clan_join_admin_team IS NOT NULL AND cc_compliance_last_date_of_climbing BETWEEN DATE_SUB(NOW(), INTERVAL 2 MONTH) AND NOW() order by admin_parthian_clan_join_admin_team asc, CAST(`stats_volunteer_for_numerator_cached` AS UNSIGNED INTEGER) DESC, CAST(`stats_attendance_indoor_wednesday_attended_cached` AS UNSIGNED INTEGER) DESC, CAST(`scores_volunteer_score_cached` AS UNSIGNED INTEGER) DESC');

  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getSheetByName('Intent');
  sheet.clearContents();
  sheet.clearFormats();

appendToSheet(sheet,results);
setColoursFormatLessThanOrEqualTo(sheet, "C3:C1000","0","#ff75d8")
setColoursFormatLessThanOrEqualTo(sheet, "C3:C1000","2","#ffd898")
setColoursFormatLessThanOrEqualTo(sheet, "C3:C1000","5","#fad02c")
setColoursFormatLessThanOrEqualTo(sheet, "E3:E1000","10","#ff75d8")
setColoursFormatLessThanOrEqualTo(sheet, "E3:E1000","20","#ffd898")
setColoursFormatLessThanOrEqualTo(sheet, "E3:E1000","30","#fad02c")



sheet.setColumnWidth(2, 150);
sheet.setColumnWidth(10, 300);
  setColoursFormat(sheet, "I1:I1000", "learner-lead-belayer", "#FFFF00")
  setColoursFormat(sheet, "I1:I1000", "lead-belayer", "#5CFF5C")
  setColoursFormat(sheet, "I1:I1000", "top", "#ADD8E6")
  setColoursFormat(sheet, "I1:I1000", "No-belaying", "#ffcccb")
setNumberFormat(sheet, "D3:D1000", "0");

results.close();
stmt.close();
//sheet.autoResizeColumns(1, numCols+1);

} 