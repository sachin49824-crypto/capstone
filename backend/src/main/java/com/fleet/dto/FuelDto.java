package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.math.BigDecimal;
import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record FuelDto(
        Long id,
        Long vehicleId,
        BigDecimal quantity,
        BigDecimal cost,
        String fuelType,
        Instant filledAt,
        Integer odometerReading,
        String location,
        String notes,
        Instant createdAt
) {}
