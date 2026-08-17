package com.fleet.service;

import com.fleet.dto.MaintenanceDto;
import com.fleet.dto.MaintenanceRequest;
import com.fleet.entity.MaintenanceLog;
import com.fleet.repository.MaintenanceLogRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceLogRepository maintenanceLogRepository;

    public MaintenanceService(MaintenanceLogRepository maintenanceLogRepository) {
        this.maintenanceLogRepository = maintenanceLogRepository;
    }

    public List<MaintenanceDto> list(Long vehicleId) {
        List<MaintenanceLog> logs = (vehicleId == null)
                ? maintenanceLogRepository.findAll(Sort.by(Sort.Direction.DESC, "serviceDate"))
                : maintenanceLogRepository.findByVehicleId(vehicleId);
        return logs.stream().map(this::toDto).toList();
    }

    public MaintenanceDto create(MaintenanceRequest request) {
        MaintenanceLog log = new MaintenanceLog();
        log.setVehicleId(request.vehicleId());
        log.setMaintenanceType(request.maintenanceType());
        log.setDescription(request.description());
        log.setServiceDate(request.serviceDate());
        log.setCost(request.cost());
        log.setNotes(null);
        log.setStatus(request.status() == null || request.status().isBlank() ? "pending" : request.status());
        return toDto(maintenanceLogRepository.save(log));
    }

    private MaintenanceDto toDto(MaintenanceLog log) {
        return new MaintenanceDto(
                log.getId(),
                log.getVehicleId(),
                log.getMaintenanceType(),
                log.getDescription(),
                log.getServiceDate(),
                log.getCost(),
                log.getNotes(),
                log.getStatus(),
                log.getCreatedAt(),
                log.getUpdatedAt()
        );
    }
}
