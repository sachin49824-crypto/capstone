package com.fleet.service;

import com.fleet.dto.LocationDto;
import com.fleet.dto.LocationRequest;
import com.fleet.entity.Location;
import com.fleet.repository.LocationRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<LocationDto> list(Long vehicleId, Long tripId) {
        List<Location> locations;
        if (vehicleId != null) {
            locations = locationRepository.findByVehicleId(vehicleId);
        } else if (tripId != null) {
            locations = locationRepository.findByTripId(tripId);
        } else {
            locations = locationRepository.findAll(Sort.by(Sort.Direction.DESC, "recordedAt"));
        }
        return locations.stream().map(this::toDto).toList();
    }

    public LocationDto create(LocationRequest request) {
        Location location = new Location();
        location.setVehicleId(request.vehicleId());
        location.setTripId(request.tripId());
        location.setLatitude(request.latitude());
        location.setLongitude(request.longitude());
        location.setAltitude(request.altitude());
        location.setAccuracy(request.accuracy());
        location.setSpeed(request.speed());
        location.setHeading(request.heading());
        location.setRecordedAt(Instant.now());
        return toDto(locationRepository.save(location));
    }

    private LocationDto toDto(Location location) {
        return new LocationDto(
                location.getId(),
                location.getVehicleId(),
                location.getTripId(),
                location.getLatitude(),
                location.getLongitude(),
                location.getAltitude(),
                location.getAccuracy(),
                location.getSpeed(),
                location.getHeading(),
                location.getRecordedAt(),
                location.getCreatedAt()
        );
    }
}
