function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  const reports = [
    readOutput,
    readVolunteers,
    readNonVolunteers,
    readLeadBelayTraining,
    readTopRopeTraining,
    readEventListing,
    readStats,
    readRoles,
    readVolunteerIntent,
    readBadgesNeeded,
    readBandsNeeded,
    readBadgesGiven,
  ];

  reports.forEach(report => report(stmt));

  stmt.close();
  conn.close();
}

