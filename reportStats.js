function readStats(stmt) {
  makeReport(stmt, {
    sheetName: "Stats",
    query: `
      SELECT 
        \`skills-belaying\` AS \`Belaying Skills\`, 
        COUNT(*) AS \`How many this week\` 
      FROM wp_member_db db 
      JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id 
      WHERE \`product_id\` = ${cell} 
        AND \`cc_location\`="${cc_location}" 
        AND \`status\` IN ("wc-processing", "wc-onhold", "wc-on-hold") 
      GROUP BY \`skills-belaying\`
    `,
    formatting: [
      { type: 'colorLessThanOrEqual', column: "How many this week", value: "5", color: "#fad02c" },
      { type: 'colorLessThanOrEqual', column: "How many this week", value: "2", color: "#ffd898" },
      { type: 'colorLessThanOrEqual', column: "How many this week", value: "0", color: "#ff75d8" },
      { type: 'color', column: "Belaying Skills", search: "learner-lead-belayer", color: "#FFFF00" },
      { type: 'color', column: "Belaying Skills", search: "lead-belayer", color: "#5CFF5C" },
      { type: 'color', column: "Belaying Skills", search: "top", color: "#ADD8E6" },
      { type: 'color', column: "Belaying Skills", search: "No-belaying", color: "#ffcccb" },
      { type: 'numberFormat', column: "How many this week", format: "0" },
      { type: 'columnWidth', column: "Belaying Skills", width: 150 }
    ]
  });
}
