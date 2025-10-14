package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.ReservationRequestDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.TableDTO;
import com.example.onlinefoodorderingsystem.DTO.ReservationDetailsDTO;
import com.example.onlinefoodorderingsystem.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/booking")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/availability")
    public ResponseEntity<List<TableDTO>> getTableAvailability(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam("fromTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime fromTime,
            @RequestParam("toTime") @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime toTime) {
        List<TableDTO> tables = bookingService.getTableAvailability(date, fromTime, toTime);
        return ResponseEntity.ok(tables);
    }

    @PostMapping("/reservations")
    public ResponseEntity<ResponseDTO> createReservation(@RequestBody ReservationRequestDTO requestDTO) {
        return bookingService.createReservation(requestDTO);
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<ReservationDetailsDTO>> getBookingsByUser(@PathVariable String email) {
        List<ReservationDetailsDTO> reservations = bookingService.getReservationsByUser(email);
        return ResponseEntity.ok(reservations);
    }

    // --- NEW ENDPOINT for the staff dashboard ---
    @GetMapping("/today")
    public ResponseEntity<List<ReservationDetailsDTO>> getTodaysReservations() {
        List<ReservationDetailsDTO> reservations = bookingService.getTodaysReservations();
        return ResponseEntity.ok(reservations);
    }
}