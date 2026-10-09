package com.fleet.service;

import com.fleet.repository.DriverRepository;
import com.fleet.repository.TripRepository;
import com.fleet.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardService(VehicleRepository vehicleRepository,
                            DriverRepository driverRepository,
                            TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    public Map<String, Object> summary() {
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalVehicles", vehicleRepository.count());
        summary.put("totalDrivers", driverRepository.count());
        summary.put("activeTrips", tripRepository.countByEndTimeIsNull());
        summary.put("vehiclesInMaintenance", vehicleRepository.countByStatus("maintenance"));
        return summary;
    }
}
