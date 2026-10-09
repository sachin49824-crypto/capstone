package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.math.BigDecimal;
import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record TripDto(
        Long id,
        Long vehicleId,
        Long driverId,
        Instant startTime,
        Instant endTime,
        String startLocation,
        String endLocation,
        BigDecimal distance,
        Integer durationMinutes,
        String status,
        BigDecimal fuelConsumed,
        String vehicleNumber,
        String driverName,
        Instant createdAt,
        Instant updatedAt
) {}
