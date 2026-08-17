package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.math.BigDecimal;
import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record LocationDto(
        Long id,
        Long vehicleId,
        Long tripId,
        BigDecimal latitude,
        BigDecimal longitude,
        BigDecimal altitude,
        BigDecimal accuracy,
        BigDecimal speed,
        BigDecimal heading,
        Instant recordedAt,
        Instant createdAt
) {}
