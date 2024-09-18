function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  const reports = [
    readOutput,

    readLeadBelayTraining,
    readTopRopeTraining,
    readEventListing,
    readStats,
    readRoles,
    readVolunteerIntent,
    readBadgesNeeded,
    readBandsNeeded,
    readBadgesGiven,
    readVolunteers,
    readNonVolunteers,
  ];

  reports.forEach(report => report(stmt));

  stmt.close();
  conn.close();
}
