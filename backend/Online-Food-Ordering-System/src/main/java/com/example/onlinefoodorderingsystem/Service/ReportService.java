package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.DashboardReportDTO;

public interface ReportService {
    /**
     * Generates a summary report for the admin dashboard.
     * @return A DTO containing aggregated sales and order data.
     */
    DashboardReportDTO getDashboardReport();
}