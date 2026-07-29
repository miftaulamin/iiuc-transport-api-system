package com.iiuc.transportapisystem.repository;

import com.iiuc.transportapisystem.model.Model;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportRepository extends JpaRepository<Model, Long> {
}