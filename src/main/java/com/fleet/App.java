package com.fleet;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Scanner;

public class App {
    private static final String DB_DIR = "db";
    private static final String DB_PATH = DB_DIR + File.separator + "fleet.db";
    private static Connection connection;

    public static void main(String[] args) {
        try (Scanner scanner = new Scanner(System.in)) {
            ensureDbDirectory();
            connectDatabase();
            Database.initializeDatabase(connection);
            System.out.println("Fleet Monitoring Console started.");
            mainMenu(scanner);
        } catch (SQLException e) {
            System.err.println("Database error: " + e.getMessage());
        } catch (SecurityException e) {
            System.err.println("Security error: " + e.getMessage());
        } finally {
            closeDatabase();
        }
    }

    private static void ensureDbDirectory() {
        File dir = new File(DB_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    private static void connectDatabase() throws SQLException {
        connection = DriverManager.getConnection("jdbc:sqlite:" + DB_PATH);
    }

    private static void closeDatabase() {
        if (connection != null) {
            try {
                connection.close();
            } catch (SQLException ignored) {}
        }
    }

    private static void mainMenu(Scanner scanner) {
        while (true) {
            System.out.println("\nChoose your role:");
            System.out.println("1) Admin");
            System.out.println("2) Fleet Manager");
            System.out.println("3) Driver");
            System.out.println("0) Exit");
            System.out.print("> ");

            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1" -> AdminMenu.show(connection, scanner);
                case "2" -> FleetManagerMenu.show(connection, scanner);
                case "3" -> {
                    System.out.print("Driver ID or name to login: ");
                    String identifier = scanner.nextLine().trim();
                    DriverMenu.show(connection, scanner, identifier);
                }
                case "0" -> {
                    System.out.println("Goodbye!");
                    return;
                }
                default -> System.out.println("Invalid selection. Please choose a number from the menu.");
            }
        }
    }
}
