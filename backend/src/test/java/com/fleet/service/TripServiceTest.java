package com.fleet.service;

import com.fleet.dto.EndTripRequest;
import com.fleet.dto.TripDto;
import com.fleet.dto.TripRequest;
import com.fleet.entity.Driver;
import com.fleet.entity.Trip;
import com.fleet.entity.Vehicle;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.TripRepository;
import com.fleet.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("all")
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private TripService tripService;

    private Trip sampleTrip;
    private Vehicle sampleVehicle;
    private Driver sampleDriver;

    @BeforeEach
    void setUp() {
        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setVehicleNumber("KA-01-AB-1234");

        sampleDriver = new Driver();
        sampleDriver.setId(10L);
        sampleDriver.setName("Sachin Tamang");

        sampleTrip = new Trip();
        sampleTrip.setId(100L);
        sampleTrip.setVehicleId(1L);
        sampleTrip.setDriverId(10L);
        sampleTrip.setStartLocation("Warehouse, Whitefield");
        sampleTrip.setStartTime(Instant.now());
        sampleTrip.setStatus("started");
    }

    @Test
    void list_AllTrips() {
        when(tripRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleTrip));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));

        List<TripDto> result = tripService.list(null);

        assertEquals(1, result.size());
        assertEquals("KA-01-AB-1234", result.get(0).vehicleNumber());
        assertEquals("Sachin Tamang", result.get(0).driverName());
    }

    @Test
    void create_Success() {
        TripRequest request = new TripRequest(1L, 10L, "Warehouse, Whitefield");
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));
        when(tripRepository.save(any(Trip.class))).thenReturn(sampleTrip);

        TripDto result = tripService.create(request);

        assertNotNull(result);
        assertEquals("started", result.status());
        verify(vehicleRepository, times(1)).save(sampleVehicle);
    }

    @Test
    void endTrip_Success() {
        EndTripRequest request = new EndTripRequest("Distribution Hub, Peenya");
        when(tripRepository.findById(100L)).thenReturn(Optional.of(sampleTrip));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(tripRepository.save(any(Trip.class))).thenReturn(sampleTrip);

        TripDto result = tripService.end(100L, request.endLocation());

        assertNotNull(result);
        verify(tripRepository, times(1)).save(sampleTrip);
    }
}
