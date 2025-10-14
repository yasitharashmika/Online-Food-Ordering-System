package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.DashboardOverviewDTO;

public interface DashboardService {
    /**
     * Gathers all necessary data for the customer dashboard overview.
     * @param userEmail The email of the user.
     * @return A DTO containing stats, active orders, and upcoming reservations.
     */
    DashboardOverviewDTO getDashboardOverview(String userEmail);
}