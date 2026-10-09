package com.fleet.controller;

import com.fleet.dto.LocationDto;
import com.fleet.dto.LocationRequest;
import com.fleet.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping
    public List<LocationDto> list(@RequestParam(required = false) Long vehicleId,
                                  @RequestParam(required = false) Long tripId) {
        return locationService.list(vehicleId, tripId);
    }

    @PostMapping
    public LocationDto create(@Valid @RequestBody LocationRequest request) {
        return locationService.create(request);
    }
}
