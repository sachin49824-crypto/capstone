package com.fleet.config;

import com.fleet.entity.Driver;
import com.fleet.entity.FuelLog;
import com.fleet.entity.Location;
import com.fleet.entity.MaintenanceLog;
import com.fleet.entity.Trip;
import com.fleet.entity.User;
import com.fleet.entity.Vehicle;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.FuelLogRepository;
import com.fleet.repository.LocationRepository;
import com.fleet.repository.MaintenanceLogRepository;
import com.fleet.repository.TripRepository;
import com.fleet.repository.UserRepository;
import com.fleet.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final LocationRepository locationRepository;
    private final MaintenanceLogRepository maintenanceLogRepository;
    private final FuelLogRepository fuelLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DriverRepository driverRepository,
                           VehicleRepository vehicleRepository,
                           TripRepository tripRepository,
                           LocationRepository locationRepository,
                           MaintenanceLogRepository maintenanceLogRepository,
                           FuelLogRepository fuelLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.locationRepository = locationRepository;
        this.maintenanceLogRepository = maintenanceLogRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = new User();
        admin.setName("Fleet Admin");
        admin.setEmail("admin@fleet.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        Driver sachin = new Driver();
        sachin.setName("Sachin Tamang");
        sachin.setPhone("+91-98765-43210");
        sachin.setLicenseNumber("DL-TN-2021-004521");
        sachin.setStatus("active");
        driverRepository.save(sachin);

        Driver priya = new Driver();
        priya.setName("Priya Sharma");
        priya.setPhone("+91-98123-45678");
        priya.setLicenseNumber("DL-KA-2022-011234");
        priya.setStatus("active");
        driverRepository.save(priya);

        Driver arjun = new Driver();
        arjun.setName("Arjun Patel");
        arjun.setPhone("+91-97654-32109");
        arjun.setLicenseNumber("DL-MH-2023-008765");
        arjun.setStatus("active");
        driverRepository.save(arjun);

        Vehicle tata = new Vehicle();
        tata.setVehicleNumber("KA-01-AB-1234");
        tata.setModel("Ace Gold");
        tata.setMake("Tata");
        tata.setYear(2021);
        tata.setColor("White");
        tata.setStatus("in_use");
        tata.setCurrentLocation("HSR Layout, Bengaluru");
        tata.setDriverId(sachin.getId());
        tata.setFuelType("diesel");
        vehicleRepository.save(tata);

        Vehicle eicher = new Vehicle();
        eicher.setVehicleNumber("KA-02-CD-5678");
        eicher.setModel("Pro 3015");
        eicher.setMake("Eicher");
        eicher.setYear(2022);
        eicher.setColor("Blue");
        eicher.setStatus("idle");
        eicher.setCurrentLocation("Peenya Industrial Area, Bengaluru");
        eicher.setDriverId(priya.getId());
        eicher.setFuelType("diesel");
        vehicleRepository.save(eicher);

        Vehicle ashok = new Vehicle();
        ashok.setVehicleNumber("KA-03-EF-9012");
        ashok.setModel("Partner");
        ashok.setMake("Ashok Leyland");
        ashok.setYear(2019);
        ashok.setColor("Red");
        ashok.setStatus("maintenance");
        ashok.setCurrentLocation("Yeshwanthpur Service Center");
        ashok.setDriverId(arjun.getId());
        ashok.setFuelType("diesel");
        vehicleRepository.save(ashok);

        Trip trip = new Trip();
        trip.setVehicleId(tata.getId());
        trip.setDriverId(sachin.getId());
        trip.setStartLocation("Warehouse, Whitefield");
        trip.setStartTime(Instant.now());
        trip.setStatus("started");
        tripRepository.save(trip);

        Location location = new Location();
        location.setVehicleId(tata.getId());
        location.setTripId(trip.getId());
        location.setLatitude(new BigDecimal("12.9715987"));
        location.setLongitude(new BigDecimal("77.5945627"));
        location.setAltitude(new BigDecimal("920.5"));
        location.setAccuracy(new BigDecimal("4.2"));
        location.setSpeed(new BigDecimal("36.4"));
        location.setHeading(new BigDecimal("128.0"));
        location.setRecordedAt(Instant.now());
        locationRepository.save(location);

        MaintenanceLog maintenanceLog = new MaintenanceLog();
        maintenanceLog.setVehicleId(ashok.getId());
        maintenanceLog.setMaintenanceType("oil_change");
        maintenanceLog.setDescription("Engine oil and filter change");
        maintenanceLog.setServiceDate(LocalDate.now());
        maintenanceLog.setCost(new BigDecimal("3500.00"));
        maintenanceLog.setStatus("in_progress");
        maintenanceLogRepository.save(maintenanceLog);

        FuelLog fuelLog = new FuelLog();
        fuelLog.setVehicleId(tata.getId());
        fuelLog.setQuantity(new BigDecimal("45.5"));
        fuelLog.setCost(new BigDecimal("3640.00"));
        fuelLog.setFuelType("diesel");
        fuelLog.setFilledAt(Instant.now());
        fuelLog.setOdometerReading(45210);
        fuelLog.setLocation("Indian Oil, Whitefield");
        fuelLogRepository.save(fuelLog);
    }
}
