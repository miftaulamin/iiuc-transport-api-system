package com.iiuc.transportapisystem.Services;

import com.iiuc.transportapisystem.Model.Model;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class Services {

    private List<Model> transports = new ArrayList<>();
    private int nextId = 1;

    // Read All
    public List<Model> getAllTransports() {
        return transports;
    }

    // Read One
    public Model getSpecificTransport(int id) {
        for (Model transport : transports) {
            if (transport.getId() == id) {
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
    public Model updateTransport(int id, Model newTransport) {
        for (Model transport : transports) {

            if (transport.getId() == id) {

                transport.setBusNumber(newTransport.getBusNumber());
                transport.setRouteName(newTransport.getRouteName());
                transport.setDriverName(newTransport.getDriverName());
                transport.setCapacity(newTransport.getCapacity());
                transport.setDepartureTime(newTransport.getDepartureTime());
                transport.setArrivalTime(newTransport.getArrivalTime());

                return transport;
            }
        }
        return null;
    }

    // Delete
    public boolean deleteTransport(int id) {
        return transports.removeIf(
            transport -> transport.getId() == id
        );
    }
}