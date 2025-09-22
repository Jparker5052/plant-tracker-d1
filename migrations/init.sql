DROP TABLE IF EXISTS care_events;
DROP TABLE IF EXISTS plants;
DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  orderIndex INTEGER DEFAULT 0
);

CREATE TABLE plants (
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
);

CREATE TABLE care_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plantId INTEGER NOT NULL,
  eventType TEXT NOT NULL,
  performedBy TEXT NOT NULL,
  performedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (plantId) REFERENCES plants(id) ON DELETE CASCADE
);

INSERT INTO rooms (name, orderIndex) VALUES 
  ('Living Room', 1),
  ('Kitchen', 2),
  ('Bedroom', 3),
  ('Bathroom', 4),
  ('Office', 5),
  ('Balcony', 6);
