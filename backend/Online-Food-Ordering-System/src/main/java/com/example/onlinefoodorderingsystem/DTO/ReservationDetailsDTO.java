package com.example.onlinefoodorderingsystem.DTO;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReservationDetailsDTO {
    private Long id;
    private Long tableId;
    private String customerName;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private int numberOfGuests;

    // --- UPDATE: Added table name and status ---
    private String tableName; // e.g., "Table 5"
    private String status;
}