package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActiveOrderDTO {
    private String id; // Use the String orderId
    private String restaurant = "CraveCorner"; // Static value
    private String items; // A summary string like "2 items"
    private String status;
    private String time; // Formatted order time
}