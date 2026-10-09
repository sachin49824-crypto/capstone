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
      vehicleNumber: vehicle.vehicle_number,
      model: vehicle.model,
      status: vehicle.status,
      currentLocation: vehicle.current_location,
      driver: vehicle.driver_name || 'Unassigned',
      driverPhone: vehicle.driver_phone || '',
    }))
  );
}

async function addVehicle() {
  const vehicle_number = await ask('Vehicle number: ');
  const model = await ask('Model: ');
  const status = (await ask('Status [idle]: ')) || 'idle';
  const current_location = await ask('Current location: ');
  const driver_id = await ask('Driver ID (leave blank if none): ');

  const id = await runSql(
    `INSERT INTO Vehicle (vehicle_number, model, status, current_location, driver_id)
     VALUES (?, ?, ?, ?, ?)`,
    [vehicle_number || null, model || null, status, current_location || null, driver_id || null]
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
  const driver_id_input = await ask('Driver ID (leave blank to keep current): ');

  const changes = await new Promise((resolve, reject) => {
    db.run(
      `UPDATE Vehicle SET
         status = COALESCE(?, status),
         current_location = COALESCE(?, current_location),
         driver_id = COALESCE(?, driver_id)
       WHERE id = ?`,
      [status || null, current_location || null, driver_id_input || null, id],
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

async function deleteVehicle() {
  const id = await ask('Vehicle ID to delete: ');
  if (!id) {
    console.log('Vehicle ID is required.');
    return;
  }

  const changes = await new Promise((resolve, reject) => {
    db.run(`DELETE FROM Vehicle WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });

  console.log(changes ? `Deleted vehicle ${id}.` : 'No vehicle deleted; check the vehicle ID.');
}

async function updateDriver() {
  const id = await ask('Driver ID: ');
  if (!id) {
    console.log('Driver ID is required.');
    return;
  }

  const name = await ask('Name (leave blank to keep current): ');
  const phone = await ask('Phone (leave blank to keep current): ');
  const license_number = await ask('License number (leave blank to keep current): ');
  const status = await ask('Status (leave blank to keep current): ');

  const changes = await new Promise((resolve, reject) => {
    db.run(
      `UPDATE Driver SET
         name = COALESCE(?, name),
         phone = COALESCE(?, phone),
         license_number = COALESCE(?, license_number),
         status = COALESCE(?, status)
       WHERE id = ?`,
      [name || null, phone || null, license_number || null, status || null, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes);
      }
    );
  });

  console.log(changes ? `Updated driver ${id}.` : 'No driver updated; check the driver ID.');
}

async function deleteDriver() {
  const id = await ask('Driver ID to delete: ');
  if (!id) {
    console.log('Driver ID is required.');
    return;
  }

  await runSql(`UPDATE Vehicle SET driver_id = NULL WHERE driver_id = ?`, [id]);

  const changes = await new Promise((resolve, reject) => {
    db.run(`DELETE FROM Driver WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });

  console.log(changes ? `Deleted driver ${id}.` : 'No driver deleted; check the driver ID.');
}

async function listTripsByStatus() {
  const status = (await ask('Trip status [all/completed/in_transit/planned]: ')).trim();
  let sql = `SELECT t.*, v.vehicle_number AS vehicle_number, d.name AS driver_name
               FROM Trip t
               LEFT JOIN Vehicle v ON t.vehicle_id = v.id
               LEFT JOIN Driver d ON t.driver_id = d.id`;
  const params = [];

  if (status && status.toLowerCase() !== 'all') {
    sql += ' WHERE t.status = ?';
    params.push(status.toLowerCase());
  }

  sql += ' ORDER BY t.start_time DESC';

  const trips = await queryAll(sql, params);

  if (!trips.length) {
    console.log('No trips found for the requested status.');
    return;
  }

  console.table(
    trips.map((trip) => ({
      id: trip.id,
      vehicleId: trip.vehicle_id,
      vehicleNumber: trip.vehicle_number,
      driver: trip.driver_name || 'Unassigned',
      startTime: trip.start_time,
      endTime: trip.end_time,
      startLocation: trip.start_location,
      status: trip.status,
    }))
  );
}

async function listVehiclesByDriver() {
  const identifier = await ask('Driver ID or name: ');
  if (!identifier) {
    console.log('Driver identifier is required.');
    return;
  }

  let query = `SELECT v.*, d.name AS driver_name, d.phone AS driver_phone
               FROM Vehicle v
               LEFT JOIN Driver d ON v.driver_id = d.id
               WHERE `;
  const params = [];

  if (/^\d+$/.test(identifier)) {
    query += 'd.id = ?';
    params.push(identifier);
  } else {
    query += 'd.name LIKE ?';
    params.push(`%${identifier}%`);
  }

  const vehicles = await queryAll(query, params);

  if (!vehicles.length) {
    console.log('No assigned vehicles found for that driver.');
    return;
  }

  console.table(
    vehicles.map((vehicle) => ({
      id: vehicle.id,
      vehicleNumber: vehicle.vehicle_number,
      model: vehicle.model,
      status: vehicle.status,
      location: vehicle.current_location,
      driver: vehicle.driver_name || 'Unassigned',
      driverPhone: vehicle.driver_phone || '',
    }))
  );
}

async function getDriverByIdentifier(identifier) {
  if (!identifier) return null;

  if (/^\d+$/.test(identifier)) {
    return queryGet(`SELECT * FROM Driver WHERE id = ?`, [identifier]);
  }

  return queryGet(`SELECT * FROM Driver WHERE name = ?`, [identifier]);
}

async function viewAssignedVehicle(driverId) {
  const vehicle = await queryGet(
    `SELECT v.*, d.name AS driver_name
       FROM Vehicle v
       LEFT JOIN Driver d ON v.driver_id = d.id
       WHERE v.driver_id = ?`,
    [driverId]
  );

  if (!vehicle) {
    console.log('No vehicle assigned to this driver.');
    return;
  }

  console.table([
    {
      id: vehicle.id,
      vehicleNumber: vehicle.vehicle_number,
      model: vehicle.model,
      status: vehicle.status,
      currentLocation: vehicle.current_location,
      driver: vehicle.driver_name || 'Unassigned',
    },
  ]);
}

async function startTrip(driverId) {
  const vehicle = await queryGet(`SELECT * FROM Vehicle WHERE driver_id = ?`, [driverId]);
  if (!vehicle) {
    console.log('No vehicle assigned. Please contact your fleet manager.');
    return;
  }

  const activeTrip = await queryGet(
    `SELECT * FROM Trip WHERE driver_id = ? AND status = 'in_transit' ORDER BY start_time DESC LIMIT 1`,
    [driverId]
  );

  if (activeTrip) {
    console.log('You already have an active trip. End it before starting a new one.');
    return;
  }

  const start_location = await ask('Start location: ');
  const now = new Date().toISOString();

  const tripId = await runSql(
    `INSERT INTO Trip (vehicle_id, driver_id, start_time, start_location, status)
       VALUES (?, ?, ?, ?, 'in_transit')`,
    [vehicle.id, driverId, now, start_location || null]
  );

  await runSql(
    `UPDATE Vehicle SET status = 'in_transit', current_location = COALESCE(?, current_location) WHERE id = ?`,
    [start_location || vehicle.current_location, vehicle.id]
  );

  console.log(`Trip started with ID ${tripId}. Vehicle ${vehicle.vehicle_number} is now in transit.`);
}

async function endTrip(driverId) {
  const trip = await queryGet(
    `SELECT t.*, v.vehicle_number, v.id AS vehicle_id
       FROM Trip t
       LEFT JOIN Vehicle v ON t.vehicle_id = v.id
       WHERE t.driver_id = ? AND t.status = 'in_transit'
       ORDER BY t.start_time DESC
       LIMIT 1`,
    [driverId]
  );

  if (!trip) {
    console.log('No active trip found to end.');
    return;
  }

  const endLocation = await ask('End location (leave blank to keep current): ');
  const now = new Date().toISOString();

  await runSql(`UPDATE Trip SET end_time = ?, status = 'completed' WHERE id = ?`, [now, trip.id]);
  await runSql(
    `UPDATE Vehicle SET status = 'idle', current_location = COALESCE(?, current_location) WHERE id = ?`,
    [endLocation || null, trip.vehicle_id]
  );

  console.log(`Trip ${trip.id} ended. Vehicle ${trip.vehicle_number} is now idle.`);
}

async function updateDriverLocationStatus(driverId) {
  const vehicle = await queryGet(`SELECT * FROM Vehicle WHERE driver_id = ?`, [driverId]);
  if (!vehicle) {
    console.log('No vehicle assigned to this driver.');
    return;
  }

  const current_location = await ask('Current location description: ');
  const status = await ask('Vehicle status [idle/in_transit/maintenance]: ');
  const latitudeInput = await ask('Latitude (leave blank if none): ');
  const longitudeInput = await ask('Longitude (leave blank if none): ');
  const recordedAtInput = await ask('Recorded at (ISO or now): ');
  const recorded_at =
    recordedAtInput.toLowerCase() === 'now'
      ? new Date().toISOString()
      : recordedAtInput || new Date().toISOString();

  const updateParams = [
    current_location || vehicle.current_location,
    status || vehicle.status,
    vehicle.id,
  ];

  await runSql(
    `UPDATE Vehicle SET current_location = ?, status = ? WHERE id = ?`,
    updateParams
  );

  if (latitudeInput || longitudeInput) {
    const latitude = latitudeInput ? parseFloat(latitudeInput) : null;
    const longitude = longitudeInput ? parseFloat(longitudeInput) : null;
    await runSql(
      `INSERT INTO Location (vehicle_id, latitude, longitude, recorded_at)
         VALUES (?, ?, ?, ?)`,
      [vehicle.id, latitude, longitude, recorded_at]
    );
  }

  console.log('Vehicle location and status updated successfully.');
}

async function adminMenu() {
  while (true) {
    console.log('\nAdmin Menu:');
    console.log('1) View all vehicles');
    console.log('2) Add vehicle');
    console.log('3) Update vehicle status / assignment');
    console.log('4) Delete vehicle');
    console.log('5) View drivers');
    console.log('6) Add driver');
    console.log('7) Update driver');
    console.log('8) Delete driver');
    console.log('9) View trips');
    console.log('10) Fleet summary');
    console.log('0) Back to role selection');

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
          await deleteVehicle();
          break;
        case '5':
          await listDrivers();
          break;
        case '6':
          await addDriver();
          break;
        case '7':
          await updateDriver();
          break;
        case '8':
          await deleteDriver();
          break;
        case '9':
          await listTrips();
          break;
        case '10':
          await showSummary();
          break;
        case '0':
          return;
        default:
          console.log('Invalid selection.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  }
}

async function fleetManagerMenu() {
  while (true) {
    console.log('\nFleet Manager Menu:');
    console.log('1) View all vehicles');
    console.log('2) View vehicles assigned to a driver');
    console.log('3) Track current locations');
    console.log('4) Monitor trips by status');
    console.log('5) Check fleet status summary');
    console.log('0) Back to role selection');

    const choice = await ask('> ');

    try {
      switch (choice) {
        case '1':
          await listVehicles();
          break;
        case '2':
          await listVehiclesByDriver();
          break;
        case '3':
          await listVehicles();
          break;
        case '4':
          await listTripsByStatus();
          break;
        case '5':
          await showSummary();
          break;
        case '0':
          return;
        default:
          console.log('Invalid selection.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  }
}

async function driverMenu(driver) {
  console.log(`\nDriver logged in: ${driver.name} (ID ${driver.id})`);

  while (true) {
    console.log('\nDriver Menu:');
    console.log('1) View assigned vehicle');
    console.log('2) Start trip');
    console.log('3) End trip');
    console.log('4) Update current location/status');
    console.log('0) Logout');

    const choice = await ask('> ');

    try {
      switch (choice) {
        case '1':
          await viewAssignedVehicle(driver.id);
          break;
        case '2':
          await startTrip(driver.id);
          break;
        case '3':
          await endTrip(driver.id);
          break;
        case '4':
          await updateDriverLocationStatus(driver.id);
          break;
        case '0':
          return;
        default:
          console.log('Invalid selection.');
      }
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  }
}

async function listTrips() {
  const trips = await queryAll(
    `SELECT t.*, v.vehicle_number AS vehicle_number, d.name AS driver_name
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
      vehicleNumber: trip.vehicle_number,
      driver: trip.driver_name || 'Unassigned',
      startTime: trip.start_time,
      endTime: trip.end_time,
      startLocation: trip.start_location,
      status: trip.status,
    }))
  );
}

async function showSummary() {
  const totalVehicles = await queryGet('SELECT COUNT(*) AS count FROM Vehicle');
  const activeVehicles = await queryGet(
    "SELECT COUNT(*) AS count FROM Vehicle WHERE status = 'active' OR status = 'in_transit'"
  );
  const totalDrivers = await queryGet('SELECT COUNT(*) AS count FROM Driver');
  const totalTrips = await queryGet('SELECT COUNT(*) AS count FROM Trip');
  const totalLocations = await queryGet('SELECT COUNT(*) AS count FROM Location');

  console.log('\nFleet Summary');
  console.log('--------------');
  console.log(`Total vehicles: ${totalVehicles.count}`);
  console.log(`Active / in-transit vehicles: ${activeVehicles.count}`);
  console.log(`Total drivers: ${totalDrivers.count}`);
  console.log(`Total trips: ${totalTrips.count}`);
  console.log(`Total location records: ${totalLocations.count}`);
}

async function mainMenu() {
  initializeDatabase();
  console.log('Fleet Monitoring Console started.');

  while (true) {
    console.log('\nChoose your role:');
    console.log('1) Admin');
    console.log('2) Fleet Manager');
    console.log('3) Driver');
    console.log('0) Exit');

    const choice = await ask('> ');

    try {
      switch (choice) {
        case '1':
          await adminMenu();
          break;
        case '2':
          await fleetManagerMenu();
          break;
        case '3': {
          const identifier = await ask('Driver ID or name to login: ');
          const driver = await getDriverByIdentifier(identifier);
          if (!driver) {
            console.log('Driver not found.');
            break;
          }
          await driverMenu(driver);
          break;
        }
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
