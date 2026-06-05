package com.iiuc.transportapisystem.controller;

import com.iiuc.transportapisystem.model.Model;
import com.iiuc.transportapisystem.services.Services;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transports")
public class Controller {

    private final Services services;

    public Controller(Services services) {
        this.services = services;
    }

    @GetMapping
    public List<Model> getAllTransports() {
        return services.getAllTransports();
    }

    @GetMapping("/{id}")
    public Model getTransportById(@PathVariable Long id) {
        return services.getSpecificTransport(id);
    }

    @PostMapping
    public Model createTransport(@RequestBody Model transport) {
        return services.createTransport(transport);
    }

    @PutMapping("/{id}")
    public Model updateTransport(
            @PathVariable Long id,
            @RequestBody Model transport) {
        return services.updateTransport(id, transport);
    }

    @DeleteMapping("/{id}")
    public Boolean deleteTransport(@PathVariable Long id) {
        return services.deleteTransport(id);
    }
}