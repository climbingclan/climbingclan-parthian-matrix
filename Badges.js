function badgesData() {

  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  var spreadsheet = SpreadsheetApp.getActive();
  let dashboard = spreadsheet.getSheetByName('Dashboard');
  var cell = dashboard.getRange('B5').getValues();
  cell = (cell[0][0] === "" || cell[0][0] === null || cell[0][0] === "#N/A") ? 18794 : cell;

  var sheet = spreadsheet.getSheetByName('Badges & Bands');
  sheet.clearContents();
  sheet.clearFormats();




// start of badges function
  function badges(flip, title)
  {
    sheet.appendRow([,title]);
    let row = sheet.getLastRow();
//console.log(row);
//sheet.getRange(row, 1, 2, 24).setFontWeight("bold");

    if (flip==="badges") {
      var results = stmt.executeQuery('select "Given Badge", db.`first_name` "First Name", db.`nickname` "Facebook Name", db.stats_volunteer_for_numerator_cached "Volunteered For", db.id "Clan ID" from wp_member_db db JOIN wp_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND `cc_location`="' + cc_location + '"  AND status in ("wc-processing", "wc-onhold", "wc-on-hold") AND ((db.`stats_volunteer_for_numerator_cached`>=3) OR (db.`stats_volunteer_for_numerator_cached`=2 AND pd.cc_volunteer<>"none")) AND ((db.milestones_3_badge IS NULL) OR (db.milestones_3_badge ="due")) order by db.`first_name`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) desc')
    }
    else if (flip==="bands"){
      var results = stmt.executeQuery('select "Given Badge", db.`first_name` "First Name", db.`nickname` "Facebook Name", db.stats_volunteer_for_numerator_cached "Volunteered For", db.id "Clan ID" from wp_member_db db JOIN wp_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND `cc_location`="' + cc_location + '"  AND status in ("wc-processing", "wc-onhold", "wc-on-hold") AND db.`skills-belaying` = "lead-belayer" AND ((db.`stats_volunteer_for_numerator_cached`>=5) OR (db.`stats_volunteer_for_numerator_cached`=4 AND pd.cc_volunteer<>"none")) AND ((db.milestones_5_band IS NULL) OR (db.milestones_5_band ="due")) order by db.`first_name`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) desc')
    }
    else if (flip==="nonbadges"){
      var results = stmt.executeQuery('select "Given Badge", db.`first_name` "First Name", db.`nickname` "Facebook Name", db.milestones_3_badge_marked_given_by "Given by", FROM_UNIXTIME((db.milestones_3_badge_marked_given_at)/1000, "%d %M %Y") "Given on" from wp_member_db db JOIN wp_order_product_customer_lookup pd on pd.user_id = db.id where product_id=' + cell + ' AND `cc_location`="' + cc_location + '"  AND status in ("wc-processing", "wc-onhold", "wc-on-hold") AND db.milestones_3_badge="given" order by db.`first_name`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) desc')
    }

    appendToSheetWithNoClear(sheet,results);





  } //end of badges

// full options
//help online beforehand,help at sign-in,help around announcements and cake time,do announcements,help online afterwards,be event director for the evening

  badges("badges", "People who need badges");
  badges("bands", "People who need bands");

//badges("nonbadges", "People who have been given badges");

  setColoursFormat(sheet, "C3:C1000","none","#DAF7A6 ")
  setColoursFormat(sheet, "C3:C1000","Selected","#FFFFFF")
  setColoursFormat(sheet, "C3:C1000","","#e0ffff")
  setTextFormat(sheet,"D2:N1000","No","#a9a9a9")
  sheet.setColumnWidth(17, 300);
  sheet.setColumnWidth(1, 150);
  setWrapped(sheet,"q2:q1000");
  var range = SpreadsheetApp.getActive().getRange("Badges & Bands!A2:A150");
  range.insertCheckboxes();




}
