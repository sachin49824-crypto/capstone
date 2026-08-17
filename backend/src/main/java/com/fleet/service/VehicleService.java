package com.fleet.service;

import com.fleet.dto.UpdateVehicleRequest;
import com.fleet.dto.VehicleDto;
import com.fleet.dto.VehicleRequest;
import com.fleet.entity.Driver;
import com.fleet.entity.Vehicle;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.VehicleRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public VehicleService(VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<VehicleDto> list(Long driverId, String status) {
        List<Vehicle> vehicles;
        if (driverId != null) {
            vehicles = vehicleRepository.findByDriverId(driverId);
        } else if (status != null && !status.isBlank()) {
            vehicles = vehicleRepository.findByStatus(status);
        } else {
            vehicles = vehicleRepository.findAll(Sort.by("id"));
        }
        return vehicles.stream().map(this::toDto).toList();
    }

    public VehicleDto get(Long id) {
        Vehicle vehicle = findOrThrow(id);
        return toDto(vehicle);
    }

    public VehicleDto create(VehicleRequest request) {
        Vehicle vehicle = new Vehicle();
        vehicle.setVehicleNumber(request.vehicleNumber());
        vehicle.setModel(request.model());
        vehicle.setMake(request.make());
        vehicle.setYear(request.year());
        vehicle.setColor(request.color());
        vehicle.setStatus(request.status() == null || request.status().isBlank() ? "idle" : request.status());
        vehicle.setCurrentLocation(request.currentLocation());
        vehicle.setDriverId(request.driverId());
        vehicle.setFuelType(request.fuelType());
        return toDto(vehicleRepository.save(vehicle));
    }

    public VehicleDto update(Long id, UpdateVehicleRequest request) {
        Vehicle vehicle = findOrThrow(id);
        if (request.status() != null) vehicle.setStatus(request.status());
        if (request.currentLocation() != null) vehicle.setCurrentLocation(request.currentLocation());
        if (request.driverId() != null) vehicle.setDriverId(request.driverId());
        return toDto(vehicleRepository.save(vehicle));
    }

    public void delete(Long id) {
        findOrThrow(id);
        vehicleRepository.deleteById(id);
    }

    public Vehicle findOrThrow(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    }

    public VehicleDto toDto(Vehicle vehicle) {
        Driver driver = vehicle.getDriverId() == null
                ? null
                : driverRepository.findById(vehicle.getDriverId()).orElse(null);
        return new VehicleDto(
                vehicle.getId(),
                vehicle.getVehicleNumber(),
                vehicle.getModel(),
                vehicle.getMake(),
                vehicle.getYear(),
                vehicle.getColor(),
                vehicle.getStatus(),
                vehicle.getCurrentLocation(),
                vehicle.getDriverId(),
                driver == null ? null : driver.getName(),
                driver == null ? null : driver.getPhone(),
                vehicle.getFuelType(),
                vehicle.getCreatedAt(),
                vehicle.getUpdatedAt()
        );
    }
}
