package com.fleet;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class SummaryService {
    public static void showSummary(Connection connection) {
        try (Statement stmt = connection.createStatement()) {
            String vehicleCountSql = "SELECT COUNT(*) AS count FROM Vehicle";
            String driverCountSql = "SELECT COUNT(*) AS count FROM Driver";
            String activeTripsSql = "SELECT COUNT(*) AS count FROM Trip WHERE end_time IS NULL";
            String maintenanceSql = "SELECT COUNT(*) AS count FROM Vehicle WHERE status = 'maintenance'";

            int vehicleCount = queryCount(stmt, vehicleCountSql);
            int driverCount = queryCount(stmt, driverCountSql);
            int activeTripsCount = queryCount(stmt, activeTripsSql);
            int maintenanceCount = queryCount(stmt, maintenanceSql);

            System.out.println("Fleet Summary");
            System.out.println("-------------");
            System.out.println("Total vehicles: " + vehicleCount);
            System.out.println("Total drivers: " + driverCount);
            System.out.println("Active trips: " + activeTripsCount);
            System.out.println("Vehicles in maintenance: " + maintenanceCount);
        } catch (SQLException e) {
            System.err.println("Unable to show summary: " + e.getMessage());
        }
    }

    private static int queryCount(Statement statement, String sql) throws SQLException {
        try (ResultSet rs = statement.executeQuery(sql)) {
            return rs.next() ? rs.getInt("count") : 0;
        }
    }
}
