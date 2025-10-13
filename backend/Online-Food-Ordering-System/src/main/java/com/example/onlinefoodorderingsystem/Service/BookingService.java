package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.ReservationRequestDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.TableDTO;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingService {
    List<TableDTO> getTableAvailability(LocalDate date, LocalTime fromTime, LocalTime toTime);
    ResponseEntity<ResponseDTO> createReservation(ReservationRequestDTO requestDTO);
}