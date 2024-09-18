function readBadges(stmt) {
  makeReport(stmt, {
    sheetName: "Badges & Bands",
    query: `
      SELECT 
        "Given Badge" AS "Given Badge",
        db.\`first_name\` AS "First Name", 
        db.\`nickname\` AS "Facebook Name", 
        db.stats_volunteer_for_numerator_cached AS "Volunteered For", 
        db.id AS "Clan ID" 
      FROM wp_member_db db 
      JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      WHERE product_id = ${cell} 
        AND \`cc_location\` = "${cc_location}"  
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold") 
        AND ((db.\`stats_volunteer_for_numerator_cached\` >= 3) 
          OR (db.\`stats_volunteer_for_numerator_cached\` = 2 AND pd.cc_volunteer <> "none")) 
        AND ((db.milestones_3_badge IS NULL) OR (db.milestones_3_badge = "due")) 
      ORDER BY db.\`first_name\`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) DESC
    `,
    formatting: [
      { type: 'color', column: "Given Badge", search: "", color: colors.lightGreen },
      { type: 'columnWidth', column: "Facebook Name", width: 150 },
      { type: 'numberFormat', column: "Volunteered For", format: "0" }
    ]
  });

  makeReport(stmt, {
    sheetName: "Badges & Bands",
    query: `
      SELECT 
        "Given Band" AS "Given Band",
        db.\`first_name\` AS "First Name", 
        db.\`nickname\` AS "Facebook Name", 
        db.stats_volunteer_for_numerator_cached AS "Volunteered For", 
        db.id AS "Clan ID" 
      FROM wp_member_db db 
      JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      WHERE product_id = ${cell} 
        AND \`cc_location\` = "${cc_location}"  
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold") 
        AND db.\`skills-belaying\` = "lead-belayer" 
        AND ((db.\`stats_volunteer_for_numerator_cached\` >= 5) 
          OR (db.\`stats_volunteer_for_numerator_cached\` = 4 AND pd.cc_volunteer <> "none")) 
        AND ((db.milestones_5_band IS NULL) OR (db.milestones_5_band = "due")) 
      ORDER BY db.\`first_name\`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) DESC
    `,
    formatting: [
      { type: 'color', column: "Given Band", search: "", color: colors.lightBlue },
      { type: 'columnWidth', column: "Facebook Name", width: 150 },
      { type: 'numberFormat', column: "Volunteered For", format: "0" }
    ]
  });

  let sheet = SpreadsheetApp.getActive().getSheetByName("Badges & Bands");
  var range = sheet.getRange("A2:A" + sheet.getLastRow());
  range.insertCheckboxes();
}


