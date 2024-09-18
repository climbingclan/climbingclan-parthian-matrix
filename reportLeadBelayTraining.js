function readLeadBelayTraining(stmt) {
  makeReport(stmt, {
    sheetName: "Lead Training",
    query: `
      SELECT DISTINCT 
        db.\`first_name\` "Name", 
        db.\`nickname\` "fbname", 
        CAST(db.\`stats_volunteer_for_numerator_cached\` AS UNSIGNED INTEGER) "Volunteering", 
        db.\`scores_volunteer_score_cached\` "Receptiveness", 
        db.\`skills-belaying\` "Belaying Skills", 
        db.\`climbing-indoors-toproping-grades\` "Indoor TR", 
        db.\`admin-wednesday-requests-notes\` as \`Requests and notes\`, 
        db.\`climbing-indoors-leading-grades\` "Indoor Lead", 
        db.\`skills-sport-climbing\` "Sport Skills" 
      FROM wp_member_db db 
      LEFT JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      JOIN wp_member_db_scores s ON s.user_id = db.id 
      WHERE \`product_id\`=${cell} 
        AND \`cc_location\`="${cc_location}" 
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold") 
        AND db.\`skills-belaying\` IN ("Top-rope-belaying","learner-lead-belayer") 
        AND (db.\`skills-sport-climbing\` IS NULL OR db.\`skills-sport-climbing\` NOT LIKE "%Lead%") 
      ORDER BY CAST(db.\`stats_volunteer_for_numerator_cached\` AS UNSIGNED INTEGER) DESC, 
        db.\`skills-belaying\` DESC, 
        db.\`skills-trad-climbing\` ASC, 
        db.\`climbing-happy-to-supervise\` DESC
    `,
    formatting: [
      { type: 'colorLessThanOrEqual', column: "Volunteering", value: "0", color: "#ff75d8" },
      { type: 'colorLessThanOrEqual', column: "Volunteering", value: "2", color: "#ffd898" },
      { type: 'colorLessThanOrEqual', column: "Volunteering", value: "5", color: "#fad02c" },
      { type: 'colorLessThanOrEqual', column: "Receptiveness", value: "10", color: "#ff75d8" },
      { type: 'colorLessThanOrEqual', column: "Receptiveness", value: "20", color: "#ffd898" },
      { type: 'colorLessThanOrEqual', column: "Receptiveness", value: "30", color: "#fad02c" },
      { type: 'color', column: "Belaying Skills", search: "learner-lead-belayer", color: "#FFFF00" },
      { type: 'color', column: "Belaying Skills", search: "lead-belayer", color: "#5CFF5C" },
      { type: 'color', column: "Belaying Skills", search: "top", color: "#ADD8E6" },
      { type: 'color', column: "Belaying Skills", search: "No-belaying", color: "#ffcccb" },
      { type: 'numberFormat', column: "Receptiveness", format: "0" },
      { type: 'columnWidth', column: "fbname", width: 150 },
      { type: 'columnWidth', column: "Requests and notes", width: 300 },
      { type: 'wrap', column: "Requests and notes" }
    ]
  });
}
