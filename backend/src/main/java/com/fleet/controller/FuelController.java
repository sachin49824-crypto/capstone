package com.fleet.controller;

import com.fleet.dto.FuelDto;
import com.fleet.dto.FuelRequest;
import com.fleet.service.FuelService;
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
@RequestMapping("/api/fuel")
public class FuelController {

    private final FuelService fuelService;

    public FuelController(FuelService fuelService) {
        this.fuelService = fuelService;
    }

    @GetMapping
    public List<FuelDto> list(@RequestParam(required = false) Long vehicleId) {
        return fuelService.list(vehicleId);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public FuelDto create(@Valid @RequestBody FuelRequest request) {
        return fuelService.create(request);
    }
}
