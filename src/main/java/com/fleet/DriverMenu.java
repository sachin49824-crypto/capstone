package com.fleet;

import java.sql.Connection;
import java.util.Scanner;

public class DriverMenu {
    public static void show(Connection connection, Scanner scanner, String identifier) {
        Driver driver = DriverService.findDriverByIdentifier(connection, identifier);
        if (driver == null) {
            System.out.println("Driver not found.");
            return;
        }

        System.out.printf("\nDriver logged in: %s (ID %d)%n", driver.getName(), driver.getId());

        while (true) {
            System.out.println("\nDriver Menu:");
            System.out.println("1) View assigned vehicle");
            System.out.println("2) Start trip");
            System.out.println("3) End trip");
            System.out.println("4) Update current location/status");
            System.out.println("0) Logout");
            System.out.print("> ");

            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1" -> VehicleService.viewAssignedVehicle(connection, driver.getId());
                case "2" -> TripService.startTrip(connection, scanner, driver.getId());
                case "3" -> TripService.endTrip(connection, scanner, driver.getId());
                case "4" -> VehicleService.updateVehicleLocationStatus(connection, scanner, driver.getId());
                case "0" -> {
                    return;
                }
                default -> System.out.println("Invalid selection.");
            }
        }
    }
}
