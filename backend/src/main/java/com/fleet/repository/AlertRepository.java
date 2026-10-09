package com.fleet.repository;

import com.fleet.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByVehicleId(Long vehicleId);
    List<Alert> findByStatus(String status);
    List<Alert> findBySeverity(String severity);
    List<Alert> findByVehicleIdAndStatus(Long vehicleId, String status);
    long countByStatus(String status);
}
