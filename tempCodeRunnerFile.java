package com.iiuc.transportapisystem.services;

import com.iiuc.transportapisystem.model.Model;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class TransportService {
    private List<Model> transports = new ArrayList<>();
    private Long nextId = 1L;

    // Read (all)
    public List<Model> getAllTransports() {
        return transports;
    }

    // Read (specific)
    public Model getSpecificTransport(Long id) {
        for (Model transport : transports) {
            if (transport.getId().equals(id)) {
                return transport;
            }
        }
        return null;
    }

    // Create
    public Model createTransport(Model transport) {
        transport.setId(nextId++);
        transports.add(transport);
        return transport;
    }

    // Update
    public Model updateTransport(Long id, Model newTransport) {
        for (Model transport : transports) {
            if (transport.getId().equals(id)) {
                transport.setBus_number(newTransport.getBus_number());
                transport.setRoute_name(newTransport.getRoute_name());
                transport.setDriver_name(newTransport.getDriver_name());
                transport.setCapacity(newTransport.getCapacity());
                transport.setDeparture_time(newTransport.getDeparture_time());
                transport.setArrival_time(newTransport.getArrival_time());
                transport.setSemester(newTransport.getSemester());
                return transport;
            }
        }
        return null;
    }

    // Delete
    public Boolean deleteTransport(Long id) {
        return transports.removeIf(transport -> transport.getId().equals(id));
    }
}
