package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotBlank;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record AlertRequest(
        Long vehicleId,
        Long tripId,
        @NotBlank String type,
        @NotBlank String severity,
        @NotBlank String message,
        String status
) {}
