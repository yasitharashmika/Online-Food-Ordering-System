package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Finds reservations that conflict with a requested time slot for a specific table on a given date.
     * An overlap occurs if an existing reservation's start time is before the new end time,
     * AND its end time is after the new start time.
     */
    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId AND r.reservationDate = :date " +
            "AND r.startTime < :endTime AND r.endTime > :startTime")
    List<Reservation> findOverlappingReservations(
            @Param("tableId") Long tableId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    // Finds all reservations for a specific date to check general availability
    List<Reservation> findByReservationDate(LocalDate date);
}