package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.DashboardReportDTO;
import com.example.onlinefoodorderingsystem.Service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reports")
@CrossOrigin
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/dashboard-summary")
    public ResponseEntity<DashboardReportDTO> getDashboardSummary() {
        DashboardReportDTO report = reportService.getDashboardReport();
        return ResponseEntity.ok(report);
    }
}