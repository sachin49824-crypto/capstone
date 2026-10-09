package com.fleet.repository;

import com.fleet.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByDriverId(Long driverId);
    long countByStatus(String status);
}
