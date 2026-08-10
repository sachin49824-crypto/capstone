package com.fleet;

public class Driver {
    private final int id;
    private final String name;
    private final String phone;
    private final String licenseNumber;
    private final String status;

    public Driver(int id, String name, String phone, String licenseNumber, String status) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.licenseNumber = licenseNumber;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public String getStatus() {
        return status;
    }
}
