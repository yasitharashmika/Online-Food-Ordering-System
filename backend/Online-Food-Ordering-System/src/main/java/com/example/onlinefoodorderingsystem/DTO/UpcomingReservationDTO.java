package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingReservationDTO {
    private Long id;
    private String restaurant = "CraveCorner"; // Static value
    private String date; // Formatted date string
    private String table; // e.g., "Table #5"
    private int guests;
    private String status = "Confirmed"; // Static for now, can be dynamic later
}