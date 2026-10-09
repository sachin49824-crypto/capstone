package com.fleet.controller;

import com.fleet.dto.EndTripRequest;
import com.fleet.dto.TripDto;
import com.fleet.dto.TripRequest;
import com.fleet.service.TripService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<TripDto> list(@RequestParam(required = false) String status) {
        return tripService.list(status);
    }

    @PostMapping
    public TripDto create(@Valid @RequestBody TripRequest request) {
        return tripService.create(request);
    }

    @PutMapping("/{id}/end")
    public TripDto end(@PathVariable Long id, @RequestBody(required = false) EndTripRequest request) {
        String endLocation = request == null ? null : request.endLocation();
        return tripService.end(id, endLocation);
    }
}
