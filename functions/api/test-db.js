export async function onRequestGet(context) {
  try {
    // Test database connection and get counts
    const rooms = await context.env.DB.prepare("SELECT COUNT(*) as count FROM rooms").first();
    const plants = await context.env.DB.prepare("SELECT COUNT(*) as count FROM plants").first();
    
    // Check if care_events exists
    const tableCheck = await context.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='care_events'"
    ).first();
    
    let eventsCount = 0;
    if (tableCheck) {
      const events = await context.env.DB.prepare("SELECT COUNT(*) as count FROM care_events").first();
      eventsCount = events.count;
    }
    
    return Response.json({
      success: true,
      database: "Connected",
      rooms: rooms.count,
      plants: plants.count,
      care_events: eventsCount,
      care_events_table: tableCheck ? "exists" : "not created yet"
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message
    });
  }
}
