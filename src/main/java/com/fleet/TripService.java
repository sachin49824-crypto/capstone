package com.fleet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.Instant;
import java.util.Scanner;

public class TripService {
    public static void listTrips(Connection connection) {
        String sql = "SELECT t.*, v.vehicle_number AS vehicle_number, d.name AS driver_name FROM Trip t LEFT JOIN Vehicle v ON t.vehicle_id = v.id LEFT JOIN Driver d ON t.driver_id = d.id ORDER BY t.start_time DESC";
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            System.out.printf("%-4s %-12s %-20s %-20s %-20s %-20s%n", "ID", "Vehicle#", "Driver", "Start Time", "End Time", "Start Location");
            while (rs.next()) {
                System.out.printf("%-4d %-12s %-20s %-20s %-20s %-20s%n",
                        rs.getInt("id"),
                        rs.getString("vehicle_number"),
                        rs.getString("driver_name"),
                        rs.getString("start_time"),
                        rs.getString("end_time"),
                        rs.getString("start_location")
                );
            }
        } catch (SQLException e) {
            System.err.println("Unable to list trips: " + e.getMessage());
        }
    }

    public static void listTripsByStatus(Connection connection, Scanner scanner) {
        System.out.print("Trip status [all]: ");
        String status = scanner.nextLine().trim();
        String sql = "SELECT t.*, v.vehicle_number AS vehicle_number, d.name AS driver_name FROM Trip t LEFT JOIN Vehicle v ON t.vehicle_id = v.id LEFT JOIN Driver d ON t.driver_id = d.id";

        if (!status.isEmpty() && !status.equalsIgnoreCase("all")) {
            sql += " WHERE t.status = ?";
        }

        sql += " ORDER BY t.start_time DESC";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            if (!status.isEmpty() && !status.equalsIgnoreCase("all")) {
                stmt.setString(1, status);
            }
            try (ResultSet rs = stmt.executeQuery()) {
                System.out.printf("%-4s %-12s %-20s %-20s %-20s %-20s%n", "ID", "Vehicle#", "Driver", "Start Time", "End Time", "Start Location");
                while (rs.next()) {
                    System.out.printf("%-4d %-12s %-20s %-20s %-20s %-20s%n",
                            rs.getInt("id"),
                            rs.getString("vehicle_number"),
                            rs.getString("driver_name"),
                            rs.getString("start_time"),
                            rs.getString("end_time"),
                            rs.getString("start_location")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Unable to list trips by status: " + e.getMessage());
        }
    }

    public static void startTrip(Connection connection, Scanner scanner, int driverId) {
        Integer vehicleId = findVehicleIdByDriver(connection, driverId);
        if (vehicleId == null) {
            System.out.println("No vehicle assigned. Please contact your fleet manager.");
            return;
        }

        System.out.print("Start location: ");
        String startLocation = scanner.nextLine().trim();
        String now = Instant.now().toString();

        String sql = "INSERT INTO Trip (vehicle_id, driver_id, start_time, start_location) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, vehicleId);
            stmt.setInt(2, driverId);
            stmt.setString(3, now);
            stmt.setString(4, startLocation);
            stmt.executeUpdate();
            System.out.println("Trip started successfully.");
        } catch (SQLException e) {
            System.err.println("Unable to start trip: " + e.getMessage());
        }
    }

    private static Integer findVehicleIdByDriver(Connection connection, int driverId) {
        String sql = "SELECT id FROM Vehicle WHERE driver_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, driverId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt("id");
                }
            }
        } catch (SQLException e) {
            System.err.println("Unable to find assigned vehicle: " + e.getMessage());
        }
        return null;
    }

    public static void endTrip(Connection connection, Scanner scanner, int driverId) {
        String sql = "SELECT t.id, t.vehicle_id, v.vehicle_number FROM Trip t LEFT JOIN Vehicle v ON t.vehicle_id = v.id WHERE t.driver_id = ? AND t.end_time IS NULL ORDER BY t.start_time DESC LIMIT 1";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, driverId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("No active trip found to end.");
                    return;
                }
                int tripId = rs.getInt("id");
                int vehicleId = rs.getInt("vehicle_id");
                String vehicleNumber = rs.getString("vehicle_number");

                System.out.print("End location (leave blank to keep current): ");
                String endLocation = scanner.nextLine().trim();
                String now = Instant.now().toString();

                try (PreparedStatement updateTrip = connection.prepareStatement("UPDATE Trip SET end_time = ? WHERE id = ?")) {
                    updateTrip.setString(1, now);
                    updateTrip.setInt(2, tripId);
                    updateTrip.executeUpdate();
                }

                if (!endLocation.isEmpty()) {
                    try (PreparedStatement updateVehicle = connection.prepareStatement("UPDATE Vehicle SET current_location = ? WHERE id = ?")) {
                        updateVehicle.setString(1, endLocation);
                        updateVehicle.setInt(2, vehicleId);
                        updateVehicle.executeUpdate();
                    }
                }

                System.out.printf("Trip %d ended. Vehicle %s updated.%n", tripId, vehicleNumber);
            }
        } catch (SQLException e) {
            System.err.println("Unable to end trip: " + e.getMessage());
        }
    }
}
