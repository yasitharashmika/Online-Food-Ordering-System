package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.DashboardReportDTO;
import com.example.onlinefoodorderingsystem.Entity.Order;
import com.example.onlinefoodorderingsystem.Repository.OrderRepository;
import com.example.onlinefoodorderingsystem.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public DashboardReportDTO getDashboardReport() {
        // Generate a report for the last 30 days of data
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);

        List<Order> recentOrders = orderRepository.findByOrderDateTimeBetween(startDate, endDate);

        // 1. Calculate Total Revenue and Total Orders from the fetched list
        double totalRevenue = recentOrders.stream()
                .mapToDouble(Order::getTotalAmount)
                .sum();
        long totalOrders = recentOrders.size();

        // 2. Group sales by date to create data points for the line chart
        Map<String, Double> salesByDate = recentOrders.stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDateTime().toLocalDate().format(DateTimeFormatter.ISO_LOCAL_DATE),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        // 3. Count orders by their status to create data for the pie/doughnut chart
        Map<String, Long> orderStatusCounts = recentOrders.stream()
                .collect(Collectors.groupingBy(
                        Order::getOrderStatus,
                        Collectors.counting()
                ));

        // 4. Create the final DTO with all the calculated data and return it
        return new DashboardReportDTO(totalRevenue, totalOrders, salesByDate, orderStatusCounts);
    }
}