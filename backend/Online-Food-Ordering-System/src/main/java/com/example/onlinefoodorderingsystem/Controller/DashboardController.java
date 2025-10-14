package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.DashboardOverviewDTO;
import com.example.onlinefoodorderingsystem.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Endpoint to get all data for the customer dashboard overview page.
     * @param userEmail The email of the logged-in user.
     * @return A consolidated DTO with stats, active orders, and upcoming reservations.
     */
    @GetMapping("/overview/{userEmail}")
    public ResponseEntity<DashboardOverviewDTO> getDashboardOverview(@PathVariable String userEmail) {
        DashboardOverviewDTO overviewData = dashboardService.getDashboardOverview(userEmail);
        return ResponseEntity.ok(overviewData);
    }
}