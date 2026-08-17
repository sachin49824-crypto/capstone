package com.fleet.dto;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

import java.time.Instant;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record DriverDto(
        Long id,
        String name,
        String phone,
        String licenseNumber,
        String status,
        Instant createdAt,
        Instant updatedAt
) {}
