package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.ReservationRequestDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.TableDTO;
import com.example.onlinefoodorderingsystem.Entity.Reservation;
import com.example.onlinefoodorderingsystem.Entity.RestaurantTable;
import com.example.onlinefoodorderingsystem.Repository.ReservationRepository;
import com.example.onlinefoodorderingsystem.Repository.RestaurantTableRepository;
import com.example.onlinefoodorderingsystem.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public List<TableDTO> getTableAvailability(LocalDate date, LocalTime fromTime, LocalTime toTime) {
        List<RestaurantTable> allTables = tableRepository.findAll();
        // Find all reservations for the chosen date to avoid multiple DB calls in a loop
        List<Reservation> reservationsForDate = reservationRepository.findByReservationDate(date);

        return allTables.stream().map(table -> {
            boolean isBooked = reservationsForDate.stream()
                    .filter(r -> r.getTable().getId().equals(table.getId()))
                    .anyMatch(r -> r.getStartTime().isBefore(toTime) && r.getEndTime().isAfter(fromTime));

            return new TableDTO(
                    table.getId(),
                    table.getSeats(),
                    isBooked ? "booked" : "available",
                    table.getArea(),
                    table.getType()
            );
        }).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseDTO> createReservation(ReservationRequestDTO requestDTO) {

        // --- UPDATE START: Add validation for time range ---
        if (requestDTO.getToTime().isBefore(requestDTO.getFromTime()) || requestDTO.getToTime().equals(requestDTO.getFromTime())) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Invalid time range. The 'To' time must be after the 'From' time.")
                    .responseCode(HttpStatus.BAD_REQUEST) // HTTP 400 Bad Request
                    .build(), HttpStatus.BAD_REQUEST);
        }
        // --- UPDATE END ---

        // Step 1: Check for conflicting reservations
        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                requestDTO.getTableId(),
                requestDTO.getDate(),
                requestDTO.getFromTime(),
                requestDTO.getToTime()
        );

        if (!overlapping.isEmpty()) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Sorry, this table is already booked for the selected time slot.")
                    .responseCode(HttpStatus.CONFLICT)
                    .build(), HttpStatus.CONFLICT);
        }

        // Step 2: Find the table entity
        RestaurantTable table = tableRepository.findById(requestDTO.getTableId())
                .orElse(null);

        if (table == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Invalid table ID.")
                    .responseCode(HttpStatus.NOT_FOUND)
                    .build(), HttpStatus.NOT_FOUND);
        }

        // Step 3: Create and save the new reservation
        Reservation newReservation = new Reservation();
        newReservation.setTable(table);
        newReservation.setCustomerName(requestDTO.getName());
        newReservation.setCustomerPhone(requestDTO.getPhone());
        newReservation.setReservationDate(requestDTO.getDate());
        newReservation.setStartTime(requestDTO.getFromTime());
        newReservation.setEndTime(requestDTO.getToTime());
        newReservation.setNumberOfGuests(requestDTO.getGuests());

        reservationRepository.save(newReservation);

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("Table booked successfully for " + requestDTO.getName() + "!")
                .responseCode(HttpStatus.CREATED)
                .build(), HttpStatus.CREATED);
    }
}