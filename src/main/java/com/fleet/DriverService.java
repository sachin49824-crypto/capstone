package com.fleet;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.Scanner;

public class DriverService {
    public static void listDrivers(Connection connection) {
        String sql = "SELECT * FROM Driver ORDER BY name";
        try (Statement stmt = connection.createStatement(); ResultSet rs = stmt.executeQuery(sql)) {
            System.out.printf("%-4s %-20s %-15s %-20s %-10s%n", "ID", "Name", "Phone", "License", "Status");
            while (rs.next()) {
                System.out.printf("%-4d %-20s %-15s %-20s %-10s%n",
                        rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("phone"),
                        rs.getString("license_number"),
                        rs.getString("status")
                );
            }
        } catch (SQLException e) {
            System.err.println("Unable to list drivers: " + e.getMessage());
        }
    }

    public static void addDriver(Connection connection, Scanner scanner) {
        System.out.print("Name: ");
        String name = scanner.nextLine().trim();
        if (name.isEmpty()) {
            System.out.println("Name is required.");
            return;
        }

        System.out.print("Phone: ");
        String phone = scanner.nextLine().trim();
        System.out.print("License number: ");
        String licenseNumber = scanner.nextLine().trim();
        System.out.print("Status [active]: ");
        String status = scanner.nextLine().trim();
        if (status.isEmpty()) status = "active";

        String sql = "INSERT INTO Driver (name, phone, license_number, status) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, name);
            stmt.setString(2, phone);
            stmt.setString(3, licenseNumber);
            stmt.setString(4, status);
            stmt.executeUpdate();
            System.out.println("Driver added successfully.");
        } catch (SQLException e) {
            System.err.println("Unable to add driver: " + e.getMessage());
        }
    }

    public static void updateDriver(Connection connection, Scanner scanner) {
        System.out.print("Driver ID: ");
        int id = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Name (leave blank to keep current): ");
        String name = scanner.nextLine().trim();
        System.out.print("Phone (leave blank to keep current): ");
        String phone = scanner.nextLine().trim();
        System.out.print("License number (leave blank to keep current): ");
        String licenseNumber = scanner.nextLine().trim();
        System.out.print("Status (leave blank to keep current): ");
        String status = scanner.nextLine().trim();

        String sql = "UPDATE Driver SET name = COALESCE(?, name), phone = COALESCE(?, phone), license_number = COALESCE(?, license_number), status = COALESCE(?, status) WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            if (name.isEmpty()) stmt.setNull(1, Types.VARCHAR); else stmt.setString(1, name);
            if (phone.isEmpty()) stmt.setNull(2, Types.VARCHAR); else stmt.setString(2, phone);
            if (licenseNumber.isEmpty()) stmt.setNull(3, Types.VARCHAR); else stmt.setString(3, licenseNumber);
            if (status.isEmpty()) stmt.setNull(4, Types.VARCHAR); else stmt.setString(4, status);
            stmt.setInt(5, id);
            int updated = stmt.executeUpdate();
            System.out.println(updated > 0 ? "Driver updated successfully." : "No driver updated; check the driver ID.");
        } catch (SQLException e) {
            System.err.println("Unable to update driver: " + e.getMessage());
        }
    }

    public static void deleteDriver(Connection connection, Scanner scanner) {
        System.out.print("Driver ID to delete: ");
        int id = Integer.parseInt(scanner.nextLine().trim());
        try (PreparedStatement resetStmt = connection.prepareStatement("UPDATE Vehicle SET driver_id = NULL WHERE driver_id = ?")) {
            resetStmt.setInt(1, id);
            resetStmt.executeUpdate();
        } catch (SQLException e) {
            System.err.println("Unable to unassign driver from vehicles: " + e.getMessage());
            return;
        }

        String sql = "DELETE FROM Driver WHERE id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setInt(1, id);
            int deleted = stmt.executeUpdate();
            System.out.println(deleted > 0 ? "Deleted driver " + id + "." : "No driver deleted; check the driver ID.");
        } catch (SQLException e) {
            System.err.println("Unable to delete driver: " + e.getMessage());
        }
    }

    public static Driver findDriverByIdentifier(Connection connection, String identifier) {
        String sql = identifier.matches("\\d+") ? "SELECT * FROM Driver WHERE id = ?" : "SELECT * FROM Driver WHERE name = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, identifier);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Driver(
                            rs.getInt("id"),
                            rs.getString("name"),
                            rs.getString("phone"),
                            rs.getString("license_number"),
                            rs.getString("status")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Unable to find driver: " + e.getMessage());
        }
        return null;
    }
}
