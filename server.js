const fs = require('fs');
const path = require('path');
const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

const DB_DIR = path.join(__dirname, 'db');
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

function initializeDatabase() {
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
  });
}

function queryAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function queryGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });
}

async function listVehicles() {
  const vehicles = await queryAll(
    `SELECT v.*, d.name AS driver_name, d.phone AS driver_phone
     FROM Vehicle v
     LEFT JOIN Driver d ON v.driver_id = d.id
     ORDER BY v.id`
  );

  if (!vehicles.length) {
    console.log('No vehicles found.');
    return;
  }

  console.table(
    vehicles.map((vehicle) => ({
      id: vehicle.id,
      vin: vehicle.vin,
      plate: vehicle.plate_number,
      model: vehicle.model,
      status: vehicle.status,
      location: vehicle.current_location,
      reportedAt: vehicle.last_reported_at,
      driver: vehicle.driver_name || 'Unassigned',
      driverPhone: vehicle.driver_phone || '',
    }))
  );
}

async function addVehicle() {
  const vin = await ask('VIN: ');
  const plate_number = await ask('Plate number: ');
  const model = await ask('Model: ');
  const status = (await ask('Status [idle]: ')) || 'idle';
  const current_location = await ask('Current location: ');
  const driver_id = await ask('Driver ID (leave blank if none): ');

  const id = await runSql(
    `INSERT INTO Vehicle (vin, plate_number, model, status, current_location, driver_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [vin || null, plate_number || null, model || null, status, current_location || null, driver_id || null]
  );

  console.log(`Vehicle added with ID ${id}.`);
}

async function updateVehicleStatus() {
  const id = await ask('Vehicle ID: ');
  if (!id) {
    console.log('Vehicle ID is required.');
    return;
  }

  const status = await ask('New status (leave blank to keep current): ');
  const current_location = await ask('New location (leave blank to keep current): ');
  const last_reported_at_input = await ask('Last reported at (ISO, leave blank to keep current, type now for current timestamp): ');
  const driver_id_input = await ask('Driver ID (leave blank to keep current): ');

  const last_reported_at =
    last_reported_at_input.toLowerCase() === 'now'
      ? new Date().toISOString()
      : last_reported_at_input || null;

  const changes = await new Promise((resolve, reject) => {
    db.run(
      `UPDATE Vehicle SET
         status = COALESCE(?, status),
         current_location = COALESCE(?, current_location),
         last_reported_at = COALESCE(?, last_reported_at),
         driver_id = COALESCE(?, driver_id)
       WHERE id = ?`,
      [status || null, current_location || null, last_reported_at, driver_id_input || null, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });

  if (!changes) {
    console.log('No vehicle updated; check the vehicle ID.');
    return;
  }

  console.log(`Updated ${changes} vehicle(s).`);
}

async function listDrivers() {
  const drivers = await queryAll('SELECT * FROM Driver ORDER BY name');
  if (!drivers.length) {
    console.log('No drivers found.');
    return;
  }
  console.table(drivers);
}

async function addDriver() {
  const name = await ask('Name: ');
  if (!name) {
    console.log('Name is required.');
    return;
  }

  const phone = await ask('Phone: ');
  const license_number = await ask('License number: ');
  const status = (await ask('Status [active]: ')) || 'active';

  const id = await runSql(
    `INSERT INTO Driver (name, phone, license_number, status)
     VALUES (?, ?, ?, ?)`,
    [name, phone || null, license_number || null, status]
  );

  console.log(`Driver added with ID ${id}.`);
}

async function listTrips() {
  const trips = await queryAll(
    `SELECT t.*, v.plate_number AS vehicle_plate, d.name AS driver_name
     FROM Trip t
     LEFT JOIN Vehicle v ON t.vehicle_id = v.id
     LEFT JOIN Driver d ON t.driver_id = d.id
     ORDER BY t.start_time DESC`
  );

  if (!trips.length) {
    console.log('No trips found.');
    return;
  }

  console.table(
    trips.map((trip) => ({
      id: trip.id,
      vehicleId: trip.vehicle_id,
      vehiclePlate: trip.vehicle_plate,
      driver: trip.driver_name || 'Unassigned',
      startTime: trip.start_time,
      endTime: trip.end_time,
      origin: trip.origin,
      destination: trip.destination,
      status: trip.status,
    }))
  );
}

async function listAlerts() {
  const alerts = await queryAll(
    `SELECT a.*, v.plate_number AS vehicle_plate, t.origin, t.destination
     FROM Alert a
     LEFT JOIN Vehicle v ON a.vehicle_id = v.id
     LEFT JOIN Trip t ON a.trip_id = t.id
     ORDER BY a.created_at DESC`
  );

  if (!alerts.length) {
    console.log('No alerts found.');
    return;
  }

  console.table(
    alerts.map((alert) => ({
      id: alert.id,
      type: alert.type,
      severity: alert.severity,
      vehicleId: alert.vehicle_id,
      vehiclePlate: alert.vehicle_plate || '',
      tripOrigin: alert.origin || '',
      tripDestination: alert.destination || '',
      status: alert.status,
      createdAt: alert.created_at,
    }))
  );
}

async function showSummary() {
  const totalVehicles = await queryGet('SELECT COUNT(*) AS count FROM Vehicle');
  const activeVehicles = await queryGet(
    "SELECT COUNT(*) AS count FROM Vehicle WHERE status = 'active' OR status = 'in_transit'"
  );
  const totalDrivers = await queryGet('SELECT COUNT(*) AS count FROM Driver');
  const openAlerts = await queryGet("SELECT COUNT(*) AS count FROM Alert WHERE status = 'open'");

  console.log('\nFleet Summary');
  console.log('--------------');
  console.log(`Total vehicles: ${totalVehicles.count}`);
  console.log(`Active / in-transit vehicles: ${activeVehicles.count}`);
  console.log(`Total drivers: ${totalDrivers.count}`);
  console.log(`Open alerts: ${openAlerts.count}`);
}

async function mainMenu() {
  initializeDatabase();
  console.log('Fleet Monitoring Console started.');

  while (true) {
    console.log('\nChoose an option:');
    console.log('1) View vehicles');
    console.log('2) Add vehicle');
    console.log('3) Update vehicle status');
    console.log('4) View drivers');
    console.log('5) Add driver');
    console.log('6) View trips');
    console.log('7) View alerts');
    console.log('8) Fleet summary');
    console.log('0) Exit');

    const choice = await ask('> ');

    try {
      switch (choice) {
        case '1':
          await listVehicles();
          break;
        case '2':
          await addVehicle();
          break;
        case '3':
          await updateVehicleStatus();
          break;
        case '4':
          await listDrivers();
          break;
        case '5':
          await addDriver();
          break;
        case '6':
          await listTrips();
          break;
        case '7':
          await listAlerts();
          break;
        case '8':
          await showSummary();
          break;
        case '0':
          console.log('Goodbye!');
          rl.close();
          db.close();
          return;
        default:
          console.log('Invalid selection. Please choose a number from the menu.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  }
}

mainMenu().catch((error) => {
  console.error('Unexpected error:', error.message || error);
  rl.close();
  db.close();
  process.exit(1);
});
