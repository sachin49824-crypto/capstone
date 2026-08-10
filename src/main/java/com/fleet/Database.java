package com.fleet;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

public class Database {
    public static void initializeDatabase(Connection connection) throws SQLException {
        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS USER ("
                    + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                    + "name TEXT NOT NULL, "
                    + "email TEXT UNIQUE NOT NULL, "
                    + "password TEXT NOT NULL, "
                    + "role TEXT NOT NULL"
                    + ")");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS Driver ("
                    + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                    + "name TEXT NOT NULL, "
                    + "phone TEXT, "
                    + "license_number TEXT, "
                    + "status TEXT DEFAULT 'active'"
                    + ")");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS Vehicle ("
                    + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                    + "vehicle_number TEXT, "
                    + "model TEXT, "
                    + "status TEXT DEFAULT 'idle', "
                    + "current_location TEXT, "
                    + "driver_id INTEGER, "
                    + "FOREIGN KEY(driver_id) REFERENCES Driver(id)"
                    + ")");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS Trip ("
                    + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                    + "vehicle_id INTEGER, "
                    + "driver_id INTEGER, "
                    + "start_time TEXT, "
                    + "end_time TEXT, "
                    + "start_location TEXT, "
                    + "FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id), "
                    + "FOREIGN KEY(driver_id) REFERENCES Driver(id)"
                    + ")");

            stmt.executeUpdate("CREATE TABLE IF NOT EXISTS Location ("
                    + "id INTEGER PRIMARY KEY AUTOINCREMENT, "
                    + "vehicle_id INTEGER, "
                    + "latitude REAL, "
                    + "longitude REAL, "
                    + "recorded_at TEXT, "
                    + "FOREIGN KEY(vehicle_id) REFERENCES Vehicle(id)"
                    + ")");
        }
    }
}
