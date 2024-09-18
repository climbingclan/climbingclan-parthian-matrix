function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  const reports = [
    readOutput,
    readVolunteers,
    readLeadBelayTraining,
    readTopRopeTraining,
    readEventListing,
    readStats,
    readRoles,
    readVolunteerIntent,
    readBadgesNeeded,
    readBandsNeeded,
  ];

  reports.forEach(report => report(stmt));

  stmt.close();
  conn.close();
}

