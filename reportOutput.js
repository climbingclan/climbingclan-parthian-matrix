function readOutput(stmt) {
  makeReport(stmt, {
    sheetName: "Output",
    query: `
      SELECT 
        db.\`admin-first-timer-indoor\` AS New, 
        "Arrived", 
        "BaseC", 
        "Paired", 
        db.\`first_name\` as "Name", 
        db.\`last_name\` as "Surname", 
        db.\`skills-belaying\` as \`Belaying Skills\`, 
        pd.cc_volunteer AS "Volunteer", 
        db.\`admin-wednesday-requests-notes\` as \`Requests and notes\`, 
        db.scores_attendance_reliability_score_cached "Reliability%", 
        \`pd\`.\`order_id\` as \`Order ID\`, 
        \`pd\`.\`user_id\` as \`Clan ID\` 
      FROM wp_member_db db 
      JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      WHERE \`product_id\`=${cell} 
        AND \`cc_location\`="${cc_location}" 
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold") 
      ORDER BY \`db\`.\`first_name\` ASC
    `,
    formatting: [
      { type: 'color', column: "New", search: "Yes", color: "#ffcccb" },
      { type: 'text', column: "New", search: "No", color: "#a9a9a9" },
      { type: 'color', column: "Arrived", search: "True", color: "#90ee90" },
      { type: 'color', column: "BaseC", search: "True", color: "#90ee90" },
      { type: 'color', column: "Paired", search: "True", color: "#90ee90" },
      { type: 'color', column: "Belaying Skills", search: "learner-lead-belayer", color: "#FFFF00" },
      { type: 'color', column: "Belaying Skills", search: "lead-belayer", color: "#5CFF5C" },
      { type: 'color', column: "Belaying Skills", search: "top", color: "#ADD8E6" },
      { type: 'color', column: "Belaying Skills", search: "No-belaying", color: "#ffcccb" },
      { type: 'text', column: "Volunteer", search: "none", color: "#a9a9a9" },
      { type: 'color', column: "Volunteer", search: "Check", color: "#ADFF2F" },
      { type: 'color', column: "Volunteer", search: "welcome", color: "#ADFF2F" },
      { type: 'color', column: "Volunteer", search: "pairing", color: "#ADFF2F" },
      { type: 'color', column: "Volunteer", search: "Event", color: "#FF00FF" },
      { type: 'text', column: "Volunteer", search: "Tuesday", color: "#DEB887" },
      { type: 'text', column: "Volunteer", search: "Wednesday", color: "#DEB887" },
      { type: 'color', column: "Volunteer", search: "Pre Cake", color: "#F0E68C" },
      { type: 'color', column: "Volunteer", search: "After Cake", color: "#F0E68C" },
      { type: 'color', column: "Volunteer", search: "Rounding", color: "#F0E68C" },
      { type: 'color', column: "Volunteer", search: "announce", color: "#FF00FF" },
      { type: 'color', column: "Volunteer", search: "floor", color: "#FFEFD5" },
      { type: 'color', column: "Volunteer", search: "Climbing Reporter", color: "#ADFF2F" },
      { type: 'colorLessThanOrEqual', column: "Reliability%", value: "50", color: "#fad02c" },
      { type: 'colorLessThanOrEqual', column: "Reliability%", value: "80", color: "#ff75d8" },
      { type: 'colorLessThanOrEqual', column: "Reliability%", value: "90", color: "#ffd898" },
      { type: 'columnWidth', column: "New", width: 31 },
      { type: 'columnWidth', column: "Name", width: 120 },
      { type: 'columnWidth', column: "Surname", width: 150 },
      { type: 'columnWidth', column: "Volunteer", width: 90 },
      { type: 'columnWidth', column: "Requests and notes", width: 300 },
      { type: 'wrap', column: "Requests and notes" }
    ]
  });

  // Add additional rows
  let sheet = SpreadsheetApp.getActive().getSheetByName("Output");
  sheet.appendRow(["","TRUE","TRUE","TRUE","Please ask latecomers and people not on the list to sign up right now at www.climbingclan.com and show you their confirmation page or confirmation email on their phone (or borrowed phone)"]);
  sheet.appendRow(["","TRUE","TRUE","TRUE","Once you've seen their confirmation page or email, you can add them below this line"]);
  sheet.appendRow(["","TRUE","TRUE","TRUE","Do this even with people who say they've already signed up"]);
  sheet.appendRow(["","TRUE","TRUE","TRUE","---------------------------------","----","-----","------"]);

  // Insert checkboxes
  let range = sheet.getRange("B2:D150");
  range.insertCheckboxes();
}
