package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    // --- UPDATE: Add the 'id' field ---
    private Long id;

    private Long foodItemId;
    private String name;
    private double price;
    private int quantity;
    private String userEmail;
}