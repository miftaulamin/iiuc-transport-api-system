package com.iiuc.transportapisystem.services;

import com.iiuc.transportapisystem.model.Model;
import com.iiuc.transportapisystem.repository.TransportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Services {

    @Autowired
    private TransportRepository repo;

    // Read all
    public List<Model> getAllTransports() {
        return repo.findAll();
    }

    // Read specific
    public Model getSpecificTransport(Long id) {
        return repo.findById(id).orElse(null);
    }

    // Create
    public Model createTransport(Model transport) {
        return repo.save(transport);
    }

    // Update
    public Model updateTransport(Long id, Model newtransport) {
        newtransport.setId(id);
        return repo.save(newtransport);
    }

    // Delete
    public Boolean deleteTransport(Long id) {
        repo.deleteById(id);
        return true;
    }
}