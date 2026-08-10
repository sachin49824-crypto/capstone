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
    db.run(`CREATE TABLE IF NOT EXISTS USER (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Driver (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      license_number TEXT,
      status TEXT DEFAULT 'active'
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Vehicle (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_number TEXT,
      model TEXT,
      status TEXT DEFAULT 'idle',
      current_location TEXT,
      driver_id INTEGER,
      FOREIGN KEY(driver_id) REFERENCES Driver(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Trip (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      driver_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      start_location TEXT,
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id),
      FOREIGN KEY(driver_id) REFERENCES Driver(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Location (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      latitude REAL,
      longitude REAL,
      recorded_at TEXT,
      FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id)
    )`);

    console.log('Database schema created successfully.');
  });
}

init();
