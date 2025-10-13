package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TableDTO {
    private Long id;
    private int seats;
    private String status; // e.g., "available", "booked"
    private String area;   // e.g., "main", "side"
    private String type;   // e.g., "large", "small"
}