package com.fleet.service;

import com.fleet.dto.UpdateVehicleRequest;
import com.fleet.dto.VehicleDto;
import com.fleet.dto.VehicleRequest;
import com.fleet.entity.Driver;
import com.fleet.entity.Vehicle;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private DriverRepository driverRepository;

    @InjectMocks
    private VehicleService vehicleService;

    private Vehicle sampleVehicle;
    private Driver sampleDriver;

    @BeforeEach
    void setUp() {
        sampleDriver = new Driver();
        sampleDriver.setId(10L);
        sampleDriver.setName("Sachin Tamang");

        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setVehicleNumber("KA-01-AB-1234");
        sampleVehicle.setModel("Ace Gold");
        sampleVehicle.setMake("Tata");
        sampleVehicle.setYear(2021);
        sampleVehicle.setStatus("idle");
        sampleVehicle.setDriverId(10L);
    }

    @Test
    void list_AllVehicles() {
        when(vehicleRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleVehicle));
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));

        List<VehicleDto> result = vehicleService.list(null, null);

        assertEquals(1, result.size());
        assertEquals("KA-01-AB-1234", result.get(0).vehicleNumber());
        assertEquals("Sachin Tamang", result.get(0).driverName());
    }

    @Test
    void get_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));

        VehicleDto result = vehicleService.get(1L);

        assertNotNull(result);
        assertEquals("KA-01-AB-1234", result.vehicleNumber());
    }

    @Test
    void get_NotFound_ThrowsException() {
        when(vehicleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> vehicleService.get(99L));
    }

    @Test
    void create_Success() {
        VehicleRequest request = new VehicleRequest("KA-01-AB-1234", "Ace Gold", "Tata", 2021, "White", "idle", "Bengaluru", 10L, "diesel");
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(sampleVehicle);
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));

        VehicleDto result = vehicleService.create(request);

        assertNotNull(result);
        assertEquals("KA-01-AB-1234", result.vehicleNumber());
    }

    @Test
    void update_Success() {
        UpdateVehicleRequest request = new UpdateVehicleRequest("in_use", "HSR Layout", 10L);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenReturn(sampleVehicle);

        VehicleDto result = vehicleService.update(1L, request);

        assertNotNull(result);
        verify(vehicleRepository, times(1)).save(sampleVehicle);
    }

    @Test
    void delete_Success() {
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));
        doNothing().when(vehicleRepository).deleteById(1L);

        vehicleService.delete(1L);

        verify(vehicleRepository, times(1)).deleteById(1L);
    }
}
