package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record FuelRequest(
        @NotNull Long vehicleId,
        @NotNull BigDecimal quantity,
        BigDecimal cost,
        String fuelType,
        Integer odometerReading,
        String location
) {}
