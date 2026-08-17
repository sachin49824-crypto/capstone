package com.fleet.service;

import com.fleet.dto.FuelDto;
import com.fleet.dto.FuelRequest;
import com.fleet.entity.FuelLog;
import com.fleet.repository.FuelLogRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class FuelService {

    private final FuelLogRepository fuelLogRepository;

    public FuelService(FuelLogRepository fuelLogRepository) {
        this.fuelLogRepository = fuelLogRepository;
    }

    public List<FuelDto> list(Long vehicleId) {
        List<FuelLog> logs = (vehicleId == null)
                ? fuelLogRepository.findAll(Sort.by(Sort.Direction.DESC, "filledAt"))
                : fuelLogRepository.findByVehicleId(vehicleId);
        return logs.stream().map(this::toDto).toList();
    }

    public FuelDto create(FuelRequest request) {
        FuelLog log = new FuelLog();
        log.setVehicleId(request.vehicleId());
        log.setQuantity(request.quantity());
        log.setCost(request.cost());
        log.setFuelType(request.fuelType());
        log.setFilledAt(Instant.now());
        log.setOdometerReading(request.odometerReading());
        log.setLocation(request.location());
        log.setNotes(null);
        return toDto(fuelLogRepository.save(log));
    }

    private FuelDto toDto(FuelLog log) {
        return new FuelDto(
                log.getId(),
                log.getVehicleId(),
                log.getQuantity(),
                log.getCost(),
                log.getFuelType(),
                log.getFilledAt(),
                log.getOdometerReading(),
                log.getLocation(),
                log.getNotes(),
                log.getCreatedAt()
        );
    }
}
