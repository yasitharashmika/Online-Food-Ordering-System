package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.ReservationRequestDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.TableDTO;
import com.example.onlinefoodorderingsystem.DTO.ReservationDetailsDTO;
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
        // This method remains unchanged
        List<RestaurantTable> allTables = tableRepository.findAll();
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

        if (requestDTO.getToTime().isBefore(requestDTO.getFromTime()) || requestDTO.getToTime().equals(requestDTO.getFromTime())) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Invalid time range. The 'To' time must be after the 'From' time.")
                    .responseCode(HttpStatus.BAD_REQUEST)
                    .build(), HttpStatus.BAD_REQUEST);
        }

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

        RestaurantTable table = tableRepository.findById(requestDTO.getTableId())
                .orElse(null);

        if (table == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Invalid table ID.")
                    .responseCode(HttpStatus.NOT_FOUND)
                    .build(), HttpStatus.NOT_FOUND);
        }

        Reservation newReservation = new Reservation();
        newReservation.setTable(table);
        newReservation.setUserEmail(requestDTO.getUserEmail());
        newReservation.setCustomerName(requestDTO.getName());
        newReservation.setCustomerPhone(requestDTO.getPhone());
        newReservation.setReservationDate(requestDTO.getDate());
        newReservation.setStartTime(requestDTO.getFromTime());
        newReservation.setEndTime(requestDTO.getToTime());
        newReservation.setNumberOfGuests(requestDTO.getGuests());
        // --- UPDATE: Set a default status for new reservations ---
        newReservation.setStatus("Confirmed");

        reservationRepository.save(newReservation);

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("Table booked successfully for " + requestDTO.getName() + "!")
                .responseCode(HttpStatus.CREATED)
                .build(), HttpStatus.CREATED);
    }

    @Override
    public List<ReservationDetailsDTO> getReservationsByUser(String userEmail) {
        List<Reservation> reservations = reservationRepository.findByUserEmailOrderByReservationDateDesc(userEmail);
        return reservations.stream()
                .map(this::mapToReservationDetailsDTO)
                .collect(Collectors.toList());
    }

    // --- NEW METHOD IMPLEMENTATION for the staff dashboard ---
    @Override
    public List<ReservationDetailsDTO> getTodaysReservations() {
        List<Reservation> reservations = reservationRepository.findByReservationDateOrderByStartTimeAsc(LocalDate.now());
        return reservations.stream()
                .map(this::mapToReservationDetailsDTO)
                .collect(Collectors.toList());
    }

    private ReservationDetailsDTO mapToReservationDetailsDTO(Reservation reservation) {
        ReservationDetailsDTO dto = new ReservationDetailsDTO();
        dto.setId(reservation.getId());
        dto.setTableId(reservation.getTable().getId());
        // --- UPDATE: Assume RestaurantTable has a getTableName() method ---
        dto.setTableName(reservation.getTable().getTableName());
        dto.setCustomerName(reservation.getCustomerName());
        dto.setReservationDate(reservation.getReservationDate());
        dto.setStartTime(reservation.getStartTime());
        dto.setEndTime(reservation.getEndTime());
        dto.setNumberOfGuests(reservation.getNumberOfGuests());
        // --- UPDATE: Map the status field ---
        dto.setStatus(reservation.getStatus());
        return dto;
    }
}