package com.iiuc.transportapisystem.model;

import jakarta.persistence.*;

@Entity
@Table(name = "transports")
public class Model {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String bus_number;
    private String route_name;
    private String driver_name;
    private Integer capacity;
    private String departure_time;
    private String arrival_time;
    private String semester;

    public Model() {
    }

    public Model(Long id, String bus_number, String route_name, String driver_name,
                 Integer capacity, String departure_time, String arrival_time, String semester) {
        this.id = id;
        this.bus_number = bus_number;
        this.route_name = route_name;
        this.driver_name = driver_name;
        this.capacity = capacity;
        this.departure_time = departure_time;
        this.arrival_time = arrival_time;
        this.semester = semester;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBus_number() {
        return bus_number;
    }

    public void setBus_number(String bus_number) {
        this.bus_number = bus_number;
    }

    public String getRoute_name() {
        return route_name;
    }

    public void setRoute_name(String route_name) {
        this.route_name = route_name;
    }

    public String getDriver_name() {
        return driver_name;
    }

    public void setDriver_name(String driver_name) {
        this.driver_name = driver_name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getDeparture_time() {
        return departure_time;
    }

    public void setDeparture_time(String departure_time) {
        this.departure_time = departure_time;
    }

    public String getArrival_time() {
        return arrival_time;
    }

    public void setArrival_time(String arrival_time) {
        this.arrival_time = arrival_time;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}