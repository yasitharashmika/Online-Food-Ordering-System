package com.example.onlinefoodorderingsystem.DTO;

import lombok.Data;

@Data
public class FoodItemDTO {
    private Long id;
    private String name;
    private Double price;
    private String category; // optional
}
