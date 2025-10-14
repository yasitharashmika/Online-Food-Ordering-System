package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailsDTO {
    private String orderId;
    private LocalDateTime orderDateTime;
    private double totalAmount;
    private String paymentMethod;
    private String orderStatus;
    private List<String> items;

    // Customer Details
    private String customerName;
    private String customerPhone;
    private String customerStreet;
    private String customerCity;
    private String customerPostalCode;

    // Rider Details
    private String assignedRider; // This will be the rider's name
}

