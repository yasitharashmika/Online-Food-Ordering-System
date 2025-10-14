package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {
    private Long id;
    private String orderId;
    private LocalDateTime orderDateTime;
    private double totalAmount;
    private String paymentMethod;
    private String orderStatus;
    private String placedBy; // This remains the customer's email
    private String tableNumber;
    private List<String> items;
    private String assignedRider;

    private String customerName;
    private String customerPhone;
    private String customerStreet;
    private String customerCity;
    private String customerPostalCode;
}
