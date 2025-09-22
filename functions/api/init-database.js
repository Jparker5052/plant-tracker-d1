export async function onRequestGet(context) {
  const results = {
    tables_created: [],
    rooms_added: [],
    errors: []
  };

  try {
    // Create rooms table
    try {
      await context.env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL UNIQUE,
          orderIndex INTEGER DEFAULT 0
        )
      `).run();
      results.tables_created.push('rooms');
    } catch (e) {
      results.errors.push(`rooms table: ${e.message}`);
    }

    // Create plants table
    try {
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
      results.tables_created.push('plants');
    } catch (e) {
      results.errors.push(`plants table: ${e.message}`);
    }

    // Create care_events table
    try {
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
      results.tables_created.push('care_events');
    } catch (e) {
      results.errors.push(`care_events table: ${e.message}`);
    }

    // Check if rooms already exist
    const roomCheck = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM rooms"
    ).first();

    if (roomCheck.count === 0) {
      // Add default rooms one by one
      const defaultRooms = [
        { name: 'Living Room', order: 1 },
        { name: 'Kitchen', order: 2 },
        { name: 'Bedroom', order: 3 },
        { name: 'Bathroom', order: 4 },
        { name: 'Office', order: 5 },
        { name: 'Balcony', order: 6 }
      ];

      for (const room of defaultRooms) {
        try {
          await context.env.DB.prepare(
            "INSERT INTO rooms (name, orderIndex) VALUES (?, ?)"
          ).bind(room.name, room.order).run();
          results.rooms_added.push(room.name);
        } catch (e) {
          // Ignore duplicate errors
          if (!e.message.includes('UNIQUE')) {
            results.errors.push(`Adding ${room.name}: ${e.message}`);
          }
        }
      }
    } else {
      results.rooms_added.push(`Already had ${roomCheck.count} rooms`);
    }

    // Add a sample plant if none exist
    const plantCheck = await context.env.DB.prepare(
      "SELECT COUNT(*) as count FROM plants"
    ).first();

    if (plantCheck.count === 0) {
      try {
        await context.env.DB.prepare(
          `INSERT INTO plants (species, nickname, roomId, lightLevel, waterIntervalDays, addedBy) 
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind('Snake Plant', 'Welcome Plant', 1, 'low', 14, 'System').run();
        results.sample_plant = 'Added welcome plant';
      } catch (e) {
        results.errors.push(`Sample plant: ${e.message}`);
      }
    }

    return Response.json({
      success: true,
      message: "Database initialized successfully!",
      details: results
    });

  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
      details: results
    }, { status: 500 });
  }
}
