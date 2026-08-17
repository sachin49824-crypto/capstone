package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record MaintenanceDto(
        Long id,
        Long vehicleId,
        String maintenanceType,
        String description,
        LocalDate serviceDate,
        BigDecimal cost,
        String notes,
        String status,
        Instant createdAt,
        Instant updatedAt
) {}
