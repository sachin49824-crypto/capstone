package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record VehicleDto(
        Long id,
        String vehicleNumber,
        String model,
        String make,
        Integer year,
        String color,
        String status,
        String currentLocation,
        Long driverId,
        String driverName,
        String driverPhone,
        String fuelType,
        Instant createdAt,
        Instant updatedAt
) {}
