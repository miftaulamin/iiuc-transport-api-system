package com.iiuc.transportapisystem.services;

import com.iiuc.transportapisystem.model.Model;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class Services {

    private List<Model> transports = new ArrayList<>();
    private Long nextid = 1L;

    // Read(all)
    public List<Model> getAllTransports() {
        return transports;
    }

    // Read(specific)
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
        transport.setId(nextid++);
        transports.add(transport);
        return transport;
    }

    // Update
    public Model updateTransport(Long id, Model newtransport) {
        for (Model transport : transports) {
            if (transport.getId().equals(id)) {
                transport.setBus_number(newtransport.getBus_number());
                transport.setRoute_name(newtransport.getRoute_name());
                transport.setDriver_name(newtransport.getDriver_name());
                transport.setCapacity(newtransport.getCapacity());
                transport.setDeparture_time(newtransport.getDeparture_time());
                transport.setArrival_time(newtransport.getArrival_time());
                transport.setSemester(newtransport.getSemester());
                return transport;
            }
        }
        return null;
    }

    // Delete
    public Boolean deleteTransport(Long id) {
        for (Model transport : transports) {
            if (transport.getId().equals(id)) {
                return transports.remove(transport);
            }
        }
        return false;
    }
}