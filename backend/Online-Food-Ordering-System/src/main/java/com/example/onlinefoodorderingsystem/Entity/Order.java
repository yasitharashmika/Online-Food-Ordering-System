package com.example.onlinefoodorderingsystem.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderId;

    @Column(nullable = false)
    private LocalDateTime orderDateTime;

    @Column(nullable = false)
    private double totalAmount;

    private String paymentMethod;
    private String placedBy;
    private String tableNumber;

    @ElementCollection
    private List<String> items;

    private String orderStatus = "Ready To Prepare";

    private String assignedRider;

    private LocalDateTime deliveredAt;
}
