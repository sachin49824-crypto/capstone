package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record AlertDto(
        Long id,
        Long vehicleId,
        String vehicleNumber,
        Long tripId,
        String type,
        String severity,
        String message,
        String status,
        Instant createdAt,
        Instant resolvedAt
) {}
