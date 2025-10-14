package com.example.onlinefoodorderingsystem.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardOverviewDTO {
    private DashboardStatsDTO stats;
    private List<ActiveOrderDTO> activeOrders;
    private List<UpcomingReservationDTO> upcomingReservations;
}