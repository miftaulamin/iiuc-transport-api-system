package com.iiuc.transportapisystem.Model;

public class Model {

    private int id;
    private String busNumber;
    private String routeName;
    private String driverName;
    private int capacity;
    private String departureTime;
    private String arrivalTime;
    public Model(){
    }

    public Model(int id, String busNumber, String routeName,
                 String driverName, int capacity,
                 String departureTime, String arrivalTime) {

        this.id = id;
        this.busNumber = busNumber;
        this.routeName = routeName;
        this.driverName = driverName;
        this.capacity = capacity;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
    }

    public int getId() {
        return id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public String getRouteName() {
        return routeName;
    }

    public String getDriverName() {
        return driverName;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
}
