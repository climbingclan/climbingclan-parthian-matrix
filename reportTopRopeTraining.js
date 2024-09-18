function readTopRopeTraining(stmt) {
  makeReport(stmt, {
    sheetName: "TR Belay Training",
    query: `
      SELECT DISTINCT 
        db.\`first_name\` "Name", 
        db.\`nickname\` "fbname",  
        CAST(\`stats_attendance_attended_cached\` AS UNSIGNED INTEGER) "Attended",
        \`skills-belaying\` "Belaying Skills",
        \`admin-wednesday-requests-notes\` as \`Requests and notes\`, 
        CAST(\`stats_volunteer_for_numerator_cached\` AS UNSIGNED INTEGER) "Volunteered"  
      FROM wp_member_db db 
      LEFT JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      JOIN wp_member_db_scores s ON s.user_id = db.id 
      WHERE \`product_id\`=${cell} 
        AND \`cc_location\`="${cc_location}"  
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold")  
        AND (\`skills-belaying\` IS NULL OR \`skills-belaying\` IN ("No-belaying", "No-Belaying")) 
      ORDER BY CAST(\`stats_attendance_attended_cached\` AS UNSIGNED INTEGER) DESC, 
        \`skills-belaying\` DESC, 
        \`skills-trad-climbing\` ASC,
        \`climbing-happy-to-supervise\` DESC
    `,
    formatting: [
      { type: 'colorLessThanOrEqual', column: "Attended", value: "0", color: "#ff75d8" },
      { type: 'colorLessThanOrEqual', column: "Attended", value: "2", color: "#ffd898" },
      { type: 'colorLessThanOrEqual', column: "Attended", value: "10", color: "#FFFFFF" },
      { type: 'color', column: "Belaying Skills", search: "No-belaying", color: "#ffcccb" },
      { type: 'columnWidth', column: "fbname", width: 150 },
      { type: 'columnWidth', column: "Requests and notes", width: 300 },
      { type: 'wrap', column: "Requests and notes" }
    ]
  });
}
