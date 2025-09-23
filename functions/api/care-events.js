export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { 
      plantId, 
      role, 
      type, 
      eventType,
      soilMoisture, 
      intervalDaysChosen, 
      snoozeDays, 
      notes,
      performedBy,
      performedAt
    } = body;
    
    // Make sure the table has all columns
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS care_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plantId INTEGER NOT NULL,
        eventType TEXT NOT NULL,
        type TEXT,
        performedBy TEXT NOT NULL,
        role TEXT,
        performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        soilMoisture TEXT,
        intervalDaysChosen INTEGER,
        snoozeDays INTEGER,
        notes TEXT
      )
    `).run();
    
    // Insert the event
    await context.env.DB.prepare(`
      INSERT INTO care_events (
        plantId, eventType, type, performedBy, role, 
        soilMoisture, intervalDaysChosen, snoozeDays, notes, performedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      plantId,
      eventType || type,
      type || eventType,
      performedBy || role,
      role || performedBy,
      soilMoisture || null,
      intervalDaysChosen || null,
      snoozeDays || null,
      notes || null
    ).run();
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Care event error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
