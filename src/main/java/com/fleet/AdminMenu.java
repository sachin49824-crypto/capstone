package com.fleet;

import java.sql.Connection;
import java.util.Scanner;

public class AdminMenu {
    public static void show(Connection connection, Scanner scanner) {
        while (true) {
            System.out.println("\nAdmin Menu:");
            System.out.println("1) View all vehicles");
            System.out.println("2) Add vehicle");
            System.out.println("3) Update vehicle status / assignment");
            System.out.println("4) Delete vehicle");
            System.out.println("5) View drivers");
            System.out.println("6) Add driver");
            System.out.println("7) Update driver");
            System.out.println("8) Delete driver");
            System.out.println("9) View trips");
            System.out.println("10) Fleet summary");
            System.out.println("0) Back to role selection");
            System.out.print("> ");

            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1" -> VehicleService.listVehicles(connection);
                case "2" -> VehicleService.addVehicle(connection, scanner);
                case "3" -> VehicleService.updateVehicleStatus(connection, scanner);
                case "4" -> VehicleService.deleteVehicle(connection, scanner);
                case "5" -> DriverService.listDrivers(connection);
                case "6" -> DriverService.addDriver(connection, scanner);
                case "7" -> DriverService.updateDriver(connection, scanner);
                case "8" -> DriverService.deleteDriver(connection, scanner);
                case "9" -> TripService.listTrips(connection);
                case "10" -> SummaryService.showSummary(connection);
                case "0" -> {
                    return;
                }
                default -> System.out.println("Invalid selection.");
            }
        }
    }
}
