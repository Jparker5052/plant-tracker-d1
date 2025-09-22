export async function onRequestGet(context) {
  try {
    // Create tables
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        orderIndex INTEGER DEFAULT 0
      )
    `).run();
    
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS plants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        species TEXT NOT NULL,
        nickname TEXT,
        roomId INTEGER NOT NULL,
        lightLevel TEXT NOT NULL,
        waterIntervalDays INTEGER DEFAULT 7,
        fertilizeIntervalDays INTEGER DEFAULT 30,
        lastWateredAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        lastFertilizedAt DATETIME,
        addedBy TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (roomId) REFERENCES rooms(id)
      )
    `).run();
    
    await context.env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS care_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        plantId INTEGER NOT NULL,
        eventType TEXT NOT NULL,
        performedBy TEXT NOT NULL,
        performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (plantId) REFERENCES plants(id) ON DELETE CASCADE
      )
    `).run();
    
    // Check if rooms exist
    const { count } = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM rooms"
    ).first();
    
    if (count === 0) {
      // Insert default rooms
      const rooms = [
        ['Living Room', 1],
        ['Kitchen', 2],
        ['Bedroom', 3],
        ['Bathroom', 4],
        ['Office', 5],
        ['Balcony', 6]
      ];
      
      for (const [name, order] of rooms) {
        await context.env.DB.prepare(
          "INSERT INTO rooms (name, orderIndex) VALUES (?, ?)"
        ).bind(name, order).run();
      }
    }
    
    return Response.json({ 
      success: true, 
      message: "Database initialized successfully!" 
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
