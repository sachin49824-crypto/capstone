package com.fleet;

import java.sql.Connection;
import java.util.Scanner;

public class FleetManagerMenu {
    public static void show(Connection connection, Scanner scanner) {
        while (true) {
            System.out.println("\nFleet Manager Menu:");
            System.out.println("1) View all vehicles");
            System.out.println("2) View vehicles assigned to a driver");
            System.out.println("3) Track current locations");
            System.out.println("4) Monitor trips by status");
            System.out.println("5) Check fleet status summary");
            System.out.println("0) Back to role selection");
            System.out.print("> ");

            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1" -> VehicleService.listVehicles(connection);
                case "2" -> VehicleService.listVehiclesByDriver(connection, scanner);
                case "3" -> VehicleService.listVehicles(connection);
                case "4" -> TripService.listTripsByStatus(connection, scanner);
                case "5" -> SummaryService.showSummary(connection);
                case "0" -> {
                    return;
                }
                default -> System.out.println("Invalid selection.");
            }
        }
    }
}
