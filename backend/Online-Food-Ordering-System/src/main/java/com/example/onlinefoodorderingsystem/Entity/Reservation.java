package com.example.onlinefoodorderingsystem.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "table_id", nullable = false)
    private RestaurantTable table;

    private String userEmail;
    private String customerName;
    private String customerPhone;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int numberOfGuests;

    // --- UPDATE: Added status field ---
    private String status; // e.g., "Confirmed", "Seated", "Completed"
}