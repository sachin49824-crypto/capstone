package com.fleet.service;

import com.fleet.dto.TripDto;
import com.fleet.dto.TripRequest;
import com.fleet.entity.Trip;
import com.fleet.entity.Vehicle;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.TripRepository;
import com.fleet.repository.VehicleRepository;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripService(TripRepository tripRepository,
                       VehicleRepository vehicleRepository,
                       DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<TripDto> list(String status) {
        List<Trip> trips = (status == null || status.isBlank())
                ? tripRepository.findAll(Sort.by(Sort.Direction.DESC, "startTime"))
                : tripRepository.findByStatus(status);
        return trips.stream().map(this::toDto).toList();
    }

    public TripDto create(TripRequest request) {
        Trip trip = new Trip();
        trip.setVehicleId(request.vehicleId());
        trip.setDriverId(request.driverId());
        trip.setStartLocation(request.startLocation());
        trip.setStartTime(Instant.now());
        trip.setStatus("started");
        return toDto(tripRepository.save(trip));
    }

    public TripDto end(Long id, String endLocation) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));
        trip.setEndTime(Instant.now());
        if (endLocation != null && !endLocation.isBlank()) {
            trip.setEndLocation(endLocation);
        }

        Vehicle vehicle = vehicleRepository.findById(trip.getVehicleId()).orElse(null);
        if (vehicle != null) {
            if (endLocation != null && !endLocation.isBlank()) {
                vehicle.setCurrentLocation(endLocation);
            }
            vehicle.setStatus("idle");
            vehicleRepository.save(vehicle);
        }

        return toDto(tripRepository.save(trip));
    }

    public TripDto toDto(Trip trip) {
        String vehicleNumber = vehicleRepository.findById(trip.getVehicleId())
                .map(Vehicle::getVehicleNumber).orElse(null);
        String driverName = driverRepository.findById(trip.getDriverId())
                .map(d -> d.getName()).orElse(null);
        return new TripDto(
                trip.getId(),
                trip.getVehicleId(),
                trip.getDriverId(),
                trip.getStartTime(),
                trip.getEndTime(),
                trip.getStartLocation(),
                trip.getEndLocation(),
                trip.getDistance(),
                trip.getDurationMinutes(),
                trip.getStatus(),
                trip.getFuelConsumed(),
                vehicleNumber,
                driverName,
                trip.getCreatedAt(),
                trip.getUpdatedAt()
        );
    }
}
