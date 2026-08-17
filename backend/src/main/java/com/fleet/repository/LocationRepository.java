package com.fleet.repository;

import com.fleet.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByVehicleId(Long vehicleId);
    List<Location> findByTripId(Long tripId);
}
