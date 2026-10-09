package com.fleet.controller;

import com.fleet.dto.AlertDto;
import com.fleet.dto.AlertRequest;
import com.fleet.service.AlertService;
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
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<AlertDto> list(@RequestParam(required = false) Long vehicleId,
                               @RequestParam(required = false) String status,
                               @RequestParam(required = false) String severity) {
        return alertService.list(vehicleId, status, severity);
    }

    @GetMapping("/{id}")
    public AlertDto get(@PathVariable Long id) {
        return alertService.get(id);
    }

    @PostMapping
    public AlertDto create(@Valid @RequestBody AlertRequest request) {
        return alertService.create(request);
    }

    @PutMapping("/{id}/resolve")
    public AlertDto resolve(@PathVariable Long id) {
        return alertService.resolve(id);
    }
}
