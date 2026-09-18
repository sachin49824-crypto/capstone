package com.fleet.service;

import com.fleet.dto.AlertDto;
import com.fleet.dto.AlertRequest;
import com.fleet.entity.Alert;
import com.fleet.repository.AlertRepository;
import com.fleet.repository.VehicleRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
@SuppressWarnings("null")
public class AlertService {

    private final AlertRepository alertRepository;
    private final VehicleRepository vehicleRepository;

    public AlertService(AlertRepository alertRepository, VehicleRepository vehicleRepository) {
        this.alertRepository = alertRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<AlertDto> list(Long vehicleId, String status, String severity) {
        List<Alert> alerts;
        if (vehicleId != null && status != null && !status.isBlank()) {
            alerts = alertRepository.findByVehicleIdAndStatus(vehicleId, status);
        } else if (vehicleId != null) {
            alerts = alertRepository.findByVehicleId(vehicleId);
        } else if (status != null && !status.isBlank()) {
            alerts = alertRepository.findByStatus(status);
        } else if (severity != null && !severity.isBlank()) {
            alerts = alertRepository.findBySeverity(severity);
        } else {
            alerts = alertRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        }
        return alerts.stream().map(this::toDto).toList();
    }

    public AlertDto get(Long id) {
        Alert alert = findOrThrow(id);
        return toDto(alert);
    }

    public AlertDto create(AlertRequest request) {
        Alert alert = new Alert();
        alert.setVehicleId(request.vehicleId());
        alert.setTripId(request.tripId());
        alert.setType(request.type());
        alert.setSeverity(request.severity() == null ? "WARNING" : request.severity().toUpperCase());
        alert.setMessage(request.message());
        alert.setStatus(request.status() == null || request.status().isBlank() ? "ACTIVE" : request.status().toUpperCase());
        return toDto(alertRepository.save(alert));
    }

    public AlertDto resolve(Long id) {
        Alert alert = findOrThrow(id);
        alert.setStatus("RESOLVED");
        alert.setResolvedAt(Instant.now());
        return toDto(alertRepository.save(alert));
    }

    public Alert findOrThrow(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alert not found"));
    }

    public AlertDto toDto(Alert alert) {
        String vehicleNumber = null;
        if (alert.getVehicleId() != null) {
            vehicleNumber = vehicleRepository.findById(alert.getVehicleId())
                    .map(v -> v.getVehicleNumber())
                    .orElse(null);
        }
        return new AlertDto(
                alert.getId(),
                alert.getVehicleId(),
                vehicleNumber,
                alert.getTripId(),
                alert.getType(),
                alert.getSeverity(),
                alert.getMessage(),
                alert.getStatus(),
                alert.getCreatedAt(),
                alert.getResolvedAt()
        );
    }
}
