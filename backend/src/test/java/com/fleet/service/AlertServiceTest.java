package com.fleet.service;

import com.fleet.dto.AlertDto;
import com.fleet.dto.AlertRequest;
import com.fleet.entity.Alert;
import com.fleet.entity.Vehicle;
import com.fleet.repository.AlertRepository;
import com.fleet.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("all")
class AlertServiceTest {

    @Mock
    private AlertRepository alertRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private AlertService alertService;

    private Alert sampleAlert;
    private Vehicle sampleVehicle;

    @BeforeEach
    void setUp() {
        sampleVehicle = new Vehicle();
        sampleVehicle.setId(1L);
        sampleVehicle.setVehicleNumber("KA-01-AB-1234");

        sampleAlert = new Alert();
        sampleAlert.setId(5L);
        sampleAlert.setVehicleId(1L);
        sampleAlert.setTripId(2L);
        sampleAlert.setType("OVERSPEED");
        sampleAlert.setSeverity("WARNING");
        sampleAlert.setMessage("Overspeeding detected");
        sampleAlert.setStatus("ACTIVE");
        sampleAlert.setCreatedAt(Instant.now());
    }

    @Test
    void list_AllAlerts() {
        when(alertRepository.findAll(any(Sort.class))).thenReturn(List.of(sampleAlert));
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));

        List<AlertDto> result = alertService.list(null, null, null);

        assertEquals(1, result.size());
        assertEquals("OVERSPEED", result.get(0).type());
        assertEquals("KA-01-AB-1234", result.get(0).vehicleNumber());
    }

    @Test
    void create_Success() {
        AlertRequest request = new AlertRequest(1L, 2L, "OVERSPEED", "WARNING", "Overspeeding detected", "ACTIVE");
        when(alertRepository.save(any(Alert.class))).thenReturn(sampleAlert);
        when(vehicleRepository.findById(1L)).thenReturn(Optional.of(sampleVehicle));

        AlertDto result = alertService.create(request);

        assertNotNull(result);
        assertEquals("OVERSPEED", result.type());
        assertEquals("ACTIVE", result.status());
    }

    @Test
    void resolve_Success() {
        when(alertRepository.findById(5L)).thenReturn(Optional.of(sampleAlert));
        when(alertRepository.save(any(Alert.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AlertDto result = alertService.resolve(5L);

        assertNotNull(result);
        assertEquals("RESOLVED", result.status());
        assertNotNull(result.resolvedAt());
    }

    @Test
    void resolve_NotFound_ThrowsException() {
        when(alertRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> alertService.resolve(99L));
    }
}
