export async function onRequestGet(context) {
  try {
    // First check if the table exists
    const tableCheck = await context.env.DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='care_events'"
    ).first();
    
    if (!tableCheck) {
      // Return empty array if table doesn't exist yet
      return Response.json([]);
    }
    
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM care_events ORDER BY performedAt DESC LIMIT 500"
    ).all();
    
    return Response.json(results || []);
  } catch (error) {
    console.error('Care events error:', error);
    // Return empty array on error to prevent app crash
    return Response.json([]);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { plantId, role, type, soilMoisture, intervalDaysChosen, snoozeDays, note } = body;
    
    // Create table if it doesn't exist
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS care_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plantId INTEGER NOT NULL,
        eventType TEXT NOT NULL,
        performedBy TEXT NOT NULL,
        performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        soilMoisture TEXT,
        intervalDaysChosen INTEGER,
        snoozeDays INTEGER,
        role TEXT
      )
    `).run();
    
    // Insert the care event
    await context.env.DB.prepare(
      `INSERT INTO care_events (
        plantId, eventType, performedBy, role, notes, 
        soilMoisture, intervalDaysChosen, snoozeDays
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      plantId, 
      type, 
      role || 'Unknown',
      role,
      note || null,
      soilMoisture || null,
      intervalDaysChosen || null,
      snoozeDays || null
    ).run();
    
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
