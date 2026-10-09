package com.fleet.service;

import com.fleet.dto.DriverDto;
import com.fleet.dto.DriverRequest;
import com.fleet.dto.UpdateDriverRequest;
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
public class DriverService {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public DriverService(DriverRepository driverRepository, VehicleRepository vehicleRepository) {
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<DriverDto> list(String status) {
        List<Driver> drivers = (status == null || status.isBlank())
                ? driverRepository.findAll(Sort.by("name"))
                : driverRepository.findByStatus(status);
        return drivers.stream().map(this::toDto).toList();
    }

    public DriverDto get(Long id) {
        return toDto(findOrThrow(id));
    }

    public DriverDto create(DriverRequest request) {
        Driver driver = new Driver();
        driver.setName(request.name());
        driver.setPhone(request.phone());
        driver.setLicenseNumber(request.licenseNumber());
        driver.setStatus(request.status() == null || request.status().isBlank() ? "active" : request.status());
        return toDto(driverRepository.save(driver));
    }

    public DriverDto update(Long id, UpdateDriverRequest request) {
        Driver driver = findOrThrow(id);
        if (request.name() != null) driver.setName(request.name());
        if (request.phone() != null) driver.setPhone(request.phone());
        if (request.licenseNumber() != null) driver.setLicenseNumber(request.licenseNumber());
        if (request.status() != null) driver.setStatus(request.status());
        return toDto(driverRepository.save(driver));
    }

    public void delete(Long id) {
        findOrThrow(id);
        List<Vehicle> vehicles = vehicleRepository.findByDriverId(id);
        for (Vehicle vehicle : vehicles) {
            vehicle.setDriverId(null);
        }
        vehicleRepository.saveAll(vehicles);
        driverRepository.deleteById(id);
    }

    public Driver findOrThrow(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver not found"));
    }

    private DriverDto toDto(Driver driver) {
        return new DriverDto(
                driver.getId(),
                driver.getName(),
                driver.getPhone(),
                driver.getLicenseNumber(),
                driver.getStatus(),
                driver.getCreatedAt(),
                driver.getUpdatedAt()
        );
    }
}
