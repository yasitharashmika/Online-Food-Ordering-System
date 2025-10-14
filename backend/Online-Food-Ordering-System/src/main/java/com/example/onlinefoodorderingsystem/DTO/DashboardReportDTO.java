package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardReportDTO {
    private double totalRevenue;
    private long totalOrders;
    private Map<String, Double> salesByDate; // Key: "YYYY-MM-DD", Value: Total Sales
    private Map<String, Long> orderStatusCounts; // Key: "Delivered", Value: Count
}