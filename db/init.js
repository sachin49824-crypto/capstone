const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_DIR = path.join(__dirname);
const DB_PATH = path.join(DB_DIR, 'fleet.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Unable to open database:', err);
    process.exit(1);
  }
});

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Driver (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      license_number TEXT,
      status TEXT DEFAULT 'active'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Vehicle (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vin TEXT,
      plate_number TEXT,
      model TEXT,
      status TEXT DEFAULT 'idle',
      current_location TEXT,
      last_reported_at TEXT,
      driver_id INTEGER,
      FOREIGN KEY(driver_id) REFERENCES Driver(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Trip (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      driver_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      origin TEXT,
      destination TEXT,
      status TEXT DEFAULT 'planned',
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id),
      FOREIGN KEY(driver_id) REFERENCES Driver(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Alert (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      trip_id INTEGER,
      type TEXT,
      severity TEXT,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      resolved_at TEXT,
      status TEXT DEFAULT 'open',
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id),
      FOREIGN KEY(trip_id) REFERENCES Trip(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Maintenance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      title TEXT,
      description TEXT,
      scheduled_date TEXT,
      completed_date TEXT,
      status TEXT DEFAULT 'scheduled',
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS LocationHistory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      timestamp TEXT,
      latitude REAL,
      longitude REAL,
      speed REAL,
      heading REAL,
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id)
    )`);

    console.log('Database schema created successfully.');
  });
}

init();
