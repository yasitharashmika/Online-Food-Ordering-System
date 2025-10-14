package com.example.onlinefoodorderingsystem.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationRequestDTO {
    private Long tableId;
    private LocalDate date;
    private LocalTime fromTime;
    private LocalTime toTime;
    private int guests;
    private String name;
    private String phone;

    // --- UPDATE: Add field to receive the user's email ---
    private String userEmail;
}