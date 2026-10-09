package com.fleet.service;

import com.fleet.dto.DriverDto;
import com.fleet.dto.DriverRequest;
import com.fleet.dto.UpdateDriverRequest;
import com.fleet.entity.Driver;
import com.fleet.repository.DriverRepository;
import com.fleet.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private DriverService driverService;

    private Driver sampleDriver;

    @BeforeEach
    void setUp() {
        sampleDriver = new Driver();
        sampleDriver.setId(10L);
        sampleDriver.setName("Priya Sharma");
        sampleDriver.setPhone("+91-98123-45678");
        sampleDriver.setLicenseNumber("DL-KA-2022-011234");
        sampleDriver.setStatus("active");
    }

    @Test
    void list_AllDrivers() {
        when(driverRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleDriver));

        List<DriverDto> result = driverService.list(null);

        assertEquals(1, result.size());
        assertEquals("Priya Sharma", result.get(0).name());
    }

    @Test
    void get_Success() {
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));

        DriverDto result = driverService.get(10L);

        assertNotNull(result);
        assertEquals("Priya Sharma", result.name());
    }

    @Test
    void create_Success() {
        DriverRequest request = new DriverRequest("Priya Sharma", "+91-98123-45678", "DL-KA-2022-011234", "active");
        when(driverRepository.save(any(Driver.class))).thenReturn(sampleDriver);

        DriverDto result = driverService.create(request);

        assertNotNull(result);
        assertEquals("Priya Sharma", result.name());
    }

    @Test
    void update_Success() {
        UpdateDriverRequest request = new UpdateDriverRequest(null, "+91-99999-99999", null, "on_leave");
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));
        when(driverRepository.save(any(Driver.class))).thenReturn(sampleDriver);

        DriverDto result = driverService.update(10L, request);

        assertNotNull(result);
        verify(driverRepository, times(1)).save(sampleDriver);
    }

    @Test
    void delete_Success() {
        when(driverRepository.findById(10L)).thenReturn(Optional.of(sampleDriver));
        when(vehicleRepository.findByDriverId(10L)).thenReturn(List.of());
        doNothing().when(driverRepository).deleteById(10L);

        driverService.delete(10L);

        verify(driverRepository, times(1)).deleteById(10L);
    }
}
