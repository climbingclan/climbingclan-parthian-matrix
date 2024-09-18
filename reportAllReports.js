function readData() {
  var conn = Jdbc.getConnection(url, username, password);
  var stmt = conn.createStatement();

  const reports = [
    readOutput,
    readStats,
    readLeadBelayTraining,
    readTopRopeTraining,
    readEventListing,
    readRoles,
    readVolunteerIntent
    // volunteerData is not updated as per your request
  ];

  reports.forEach(report => report(stmt));

  stmt.close();
  conn.close();
}
