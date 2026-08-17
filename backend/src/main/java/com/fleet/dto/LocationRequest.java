package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record LocationRequest(
        @NotNull Long vehicleId,
        Long tripId,
        @NotNull BigDecimal latitude,
        @NotNull BigDecimal longitude,
        BigDecimal altitude,
        BigDecimal accuracy,
        BigDecimal speed,
        BigDecimal heading
) {}
