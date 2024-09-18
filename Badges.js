function readBadgesData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  readBadgesNeeded(stmt);
  readBandsNeeded(stmt);
  readBadgesGiven(stmt);

  stmt.close();
  conn.close();
}

function readBadgesNeeded(stmt) {
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
      WHERE product_id=${cell}
        AND \`cc_location\`="${cc_location}"
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold")
        AND ((db.\`stats_volunteer_for_numerator_cached\`>=3) OR (db.\`stats_volunteer_for_numerator_cached\`=2 AND pd.cc_volunteer<>"none"))
        AND ((db.milestones_3_badge IS NULL) OR (db.milestones_3_badge ="due"))
      ORDER BY db.\`first_name\`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) DESC
    `,
    formatting: [
      { type: 'color', column: "Given Badge", search: "", color: colors.lightGreen },
      { type: 'numberFormat', column: "Volunteered For", format: "0" },
      { type: 'columnWidth', column: "Facebook Name", width: 150 },
      { type: 'columnWidth', column: "Clan ID", width: 100 },
    ],
    title: "People who need badges"
  });
}

function readBandsNeeded(stmt) {
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
      WHERE product_id=${cell}
        AND \`cc_location\`="${cc_location}"
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold")
        AND db.\`skills-belaying\` = "lead-belayer"
        AND ((db.\`stats_volunteer_for_numerator_cached\`>=5) OR (db.\`stats_volunteer_for_numerator_cached\`=4 AND pd.cc_volunteer<>"none"))
        AND ((db.milestones_5_band IS NULL) OR (db.milestones_5_band ="due"))
      ORDER BY db.\`first_name\`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) DESC
    `,
    formatting: [
      { type: 'color', column: "Given Badge", search: "", color: colors.lightBlue },
      { type: 'numberFormat', column: "Volunteered For", format: "0" },
      { type: 'columnWidth', column: "Facebook Name", width: 150 },
      { type: 'columnWidth', column: "Clan ID", width: 100 },
    ],
    title: "People who need bands"
  });
}

function readBadgesGiven(stmt) {
  makeReport(stmt, {
    sheetName: "Badges & Bands",
    query: `
      SELECT 
        "Given Badge" AS "Given Badge",
        db.\`first_name\` AS "First Name",
        db.\`nickname\` AS "Facebook Name",
        db.milestones_3_badge_marked_given_by AS "Given by",
        FROM_UNIXTIME((db.milestones_3_badge_marked_given_at)/1000, "%d %M %Y") AS "Given on"
      FROM wp_member_db db
      JOIN wp_order_product_customer_lookup pd ON pd.user_id = db.id
      WHERE product_id=${cell}
        AND \`cc_location\`="${cc_location}"
        AND status IN ("wc-processing", "wc-onhold", "wc-on-hold")
        AND db.milestones_3_badge="given"
      ORDER BY db.\`first_name\`, CAST(db.stats_volunteer_for_numerator_cached AS UNSIGNED INTEGER) DESC
    `,
    formatting: [
      { type: 'color', column: "Given Badge", search: "", color: colors.lightYellow },
      { type: 'columnWidth', column: "Facebook Name", width: 150 },
      { type: 'columnWidth', column: "Given by", width: 150 },
      { type: 'columnWidth', column: "Given on", width: 120 },
    ],
    title: "People who have been given badges"
  });
}
