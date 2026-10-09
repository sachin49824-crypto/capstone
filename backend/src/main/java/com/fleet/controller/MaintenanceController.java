package com.fleet.controller;

import com.fleet.dto.MaintenanceDto;
import com.fleet.dto.MaintenanceRequest;
import com.fleet.service.MaintenanceService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping
    public List<MaintenanceDto> list(@RequestParam(required = false) Long vehicleId) {
        return maintenanceService.list(vehicleId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public MaintenanceDto create(@Valid @RequestBody MaintenanceRequest request) {
        return maintenanceService.create(request);
    }
}
