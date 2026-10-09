package com.fleet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.Scanner;

public class VehicleService {
    public static void listVehicles(Connection connection) {
        String sql = "SELECT v.*, d.name AS driver_name, d.phone AS driver_phone FROM Vehicle v LEFT JOIN Driver d ON v.driver_id = d.id ORDER BY v.id";
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            System.out.printf("%-4s %-15s %-15s %-12s %-20s %-15s %-15s%n", "ID", "Vehicle#", "Model", "Status", "Location", "Driver", "Phone");
            while (rs.next()) {
                System.out.printf("%-4d %-15s %-15s %-12s %-20s %-15s %-15s%n",
                        rs.getInt("id"),
                        rs.getString("vehicle_number"),
                        rs.getString("model"),
                        rs.getString("status"),
                        rs.getString("current_location"),
                        rs.getString("driver_name"),
                        rs.getString("driver_phone")
                );
            }
        } catch (SQLException e) {
            System.err.println("Unable to list vehicles: " + e.getMessage());
        }
    }

    public static void addVehicle(Connection connection, Scanner scanner) {
        System.out.print("Vehicle number: ");
        String vehicleNumber = scanner.nextLine().trim();
        System.out.print("Model: ");
        String model = scanner.nextLine().trim();
        System.out.print("Status [idle]: ");
        String status = scanner.nextLine().trim();
        if (status.isEmpty()) status = "idle";
        System.out.print("Current location: ");
        String location = scanner.nextLine().trim();
        System.out.print("Driver ID (leave blank if none): ");
        String driverIdInput = scanner.nextLine().trim();

        String sql = "INSERT INTO Vehicle (vehicle_number, model, status, current_location, driver_id) VALUES (?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, vehicleNumber);
            stmt.setString(2, model);
            stmt.setString(3, status);
            stmt.setString(4, location);
            if (driverIdInput.isEmpty()) {
                stmt.setNull(5, Types.INTEGER);
            } else {
                stmt.setInt(5, Integer.parseInt(driverIdInput));
            }
            stmt.executeUpdate();
            System.out.println("Vehicle added successfully.");
        } catch (SQLException e) {
            System.err.println("Unable to add vehicle: " + e.getMessage());
        }
    }

    public static void updateVehicleStatus(Connection connection, Scanner scanner) {
        System.out.print("Vehicle ID: ");
        int id = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("New status (leave blank to keep current): ");
        String status = scanner.nextLine().trim();
        System.out.print("New location (leave blank to keep current): ");
        String location = scanner.nextLine().trim();
        System.out.print("Driver ID (leave blank to keep current): ");
        String driverIdInput = scanner.nextLine().trim();

        String sql = "UPDATE Vehicle SET status = COALESCE(?, status), current_location = COALESCE(?, current_location), driver_id = COALESCE(?, driver_id) WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            if (status.isEmpty()) stmt.setNull(1, Types.VARCHAR); else stmt.setString(1, status);
            if (location.isEmpty()) stmt.setNull(2, Types.VARCHAR); else stmt.setString(2, location);
            if (driverIdInput.isEmpty()) stmt.setNull(3, Types.INTEGER); else stmt.setInt(3, Integer.parseInt(driverIdInput));
            stmt.setInt(4, id);
            int updated = stmt.executeUpdate();
            System.out.println(updated > 0 ? "Vehicle updated successfully." : "No vehicle updated; check the vehicle ID.");
        } catch (SQLException e) {
            System.err.println("Unable to update vehicle: " + e.getMessage());
        }
    }

    public static void deleteVehicle(Connection connection, Scanner scanner) {
        System.out.print("Vehicle ID to delete: ");
        int id = Integer.parseInt(scanner.nextLine().trim());
        String sql = "DELETE FROM Vehicle WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            int deleted = stmt.executeUpdate();
            System.out.println(deleted > 0 ? "Deleted vehicle " + id + "." : "No vehicle deleted; check the vehicle ID.");
        } catch (SQLException e) {
            System.err.println("Unable to delete vehicle: " + e.getMessage());
        }
    }

    public static void listVehiclesByDriver(Connection connection, Scanner scanner) {
        System.out.print("Driver ID or name: ");
        String identifier = scanner.nextLine().trim();
        String sql = "SELECT v.*, d.name AS driver_name, d.phone AS driver_phone FROM Vehicle v LEFT JOIN Driver d ON v.driver_id = d.id WHERE ";

        if (identifier.matches("\\d+")) {
            sql += "d.id = ?";
        } else {
            sql += "d.name LIKE ?";
            identifier = "%" + identifier + "%";
        }

        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, identifier);
            try (ResultSet rs = stmt.executeQuery()) {
                System.out.printf("%-4s %-15s %-15s %-12s %-20s %-15s %-15s%n", "ID", "Vehicle#", "Model", "Status", "Location", "Driver", "Phone");
                while (rs.next()) {
                    System.out.printf("%-4d %-15s %-15s %-12s %-20s %-15s %-15s%n",
                            rs.getInt("id"),
                            rs.getString("vehicle_number"),
                            rs.getString("model"),
                            rs.getString("status"),
                            rs.getString("current_location"),
                            rs.getString("driver_name"),
                            rs.getString("driver_phone")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Unable to list vehicles by driver: " + e.getMessage());
        }
    }

    public static void viewAssignedVehicle(Connection connection, int driverId) {
        String sql = "SELECT v.*, d.name AS driver_name FROM Vehicle v LEFT JOIN Driver d ON v.driver_id = d.id WHERE v.driver_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, driverId);
            try (ResultSet rs = stmt.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("No vehicle assigned to this driver.");
                    return;
                }
                System.out.printf("%-4s %-15s %-15s %-12s %-20s %-15s%n", "ID", "Vehicle#", "Model", "Status", "Location", "Driver");
                System.out.printf("%-4d %-15s %-15s %-12s %-20s %-15s%n",
                        rs.getInt("id"),
                        rs.getString("vehicle_number"),
                        rs.getString("model"),
                        rs.getString("status"),
                        rs.getString("current_location"),
                        rs.getString("driver_name")
                );
            }
        } catch (SQLException e) {
            System.err.println("Unable to view assigned vehicle: " + e.getMessage());
        }
    }

    public static void updateVehicleLocationStatus(Connection connection, Scanner scanner, int driverId) {
        String vehicleSql = "SELECT * FROM Vehicle WHERE driver_id = ?";
        try (PreparedStatement findStmt = connection.prepareStatement(vehicleSql)) {
            findStmt.setInt(1, driverId);
            try (ResultSet rs = findStmt.executeQuery()) {
                if (!rs.next()) {
                    System.out.println("No vehicle assigned to this driver.");
                    return;
                }
            }
        } catch (SQLException e) {
            System.err.println("Unable to locate driver vehicle: " + e.getMessage());
            return;
        }

        System.out.print("Current location description: ");
        String location = scanner.nextLine().trim();
        System.out.print("Vehicle status [idle/in_transit/maintenance]: ");
        String status = scanner.nextLine().trim();
        System.out.print("Latitude (leave blank if none): ");
        String latitudeInput = scanner.nextLine().trim();
        System.out.print("Longitude (leave blank if none): ");
        String longitudeInput = scanner.nextLine().trim();
        System.out.print("Recorded at (ISO or now): ");
        String recordedAt = scanner.nextLine().trim();
        if (recordedAt.isEmpty()) {
            recordedAt = java.time.Instant.now().toString();
        }

        String updateSql = "UPDATE Vehicle SET current_location = COALESCE(?, current_location), status = COALESCE(?, status) WHERE driver_id = ?";
        try (PreparedStatement updateStmt = connection.prepareStatement(updateSql)) {
            if (location.isEmpty()) updateStmt.setNull(1, Types.VARCHAR); else updateStmt.setString(1, location);
            if (status.isEmpty()) updateStmt.setNull(2, Types.VARCHAR); else updateStmt.setString(2, status);
            updateStmt.setInt(3, driverId);
            updateStmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Unable to update vehicle location/status: " + e.getMessage());
            return;
        }

        if (!latitudeInput.isEmpty() || !longitudeInput.isEmpty()) {
            String insertLocationSql = "INSERT INTO Location (vehicle_id, latitude, longitude, recorded_at) VALUES ((SELECT id FROM Vehicle WHERE driver_id = ?), ?, ?, ?)";
            try (PreparedStatement locationStmt = connection.prepareStatement(insertLocationSql)) {
                locationStmt.setInt(1, driverId);
                if (latitudeInput.isEmpty()) {
                    locationStmt.setNull(2, Types.REAL);
                } else {
                    locationStmt.setDouble(2, Double.parseDouble(latitudeInput));
                }
                if (longitudeInput.isEmpty()) {
                    locationStmt.setNull(3, Types.REAL);
                } else {
                    locationStmt.setDouble(3, Double.parseDouble(longitudeInput));
                }
                locationStmt.setString(4, recordedAt);
                locationStmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("Unable to record location: " + e.getMessage());
            }
        }

        System.out.println("Vehicle location and status updated successfully.");
    }
}
