package com.fleet.controller;

import com.fleet.dto.DriverDto;
import com.fleet.dto.DriverRequest;
import com.fleet.dto.UpdateDriverRequest;
import com.fleet.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping
    public List<DriverDto> list(@RequestParam(required = false) String status) {
        return driverService.list(status);
    }

    @GetMapping("/{id}")
    public DriverDto get(@PathVariable Long id) {
        return driverService.get(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DriverDto create(@Valid @RequestBody DriverRequest request) {
        return driverService.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public DriverDto update(@PathVariable Long id, @RequestBody UpdateDriverRequest request) {
        return driverService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        driverService.delete(id);
    }
}
