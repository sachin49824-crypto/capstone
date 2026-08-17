package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record MaintenanceRequest(
        @NotNull Long vehicleId,
        @NotBlank String maintenanceType,
        String description,
        LocalDate serviceDate,
        BigDecimal cost,
        String status
) {}
