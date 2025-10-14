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

    @Query("SELECT r FROM Reservation r WHERE r.table.id = :tableId AND r.reservationDate = :date " +
            "AND r.startTime < :endTime AND r.endTime > :startTime")
    List<Reservation> findOverlappingReservations(
            @Param("tableId") Long tableId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);

    List<Reservation> findByReservationDate(LocalDate date);

    // --- NEW METHOD for fetching today's reservations for the dashboard ---
    List<Reservation> findByReservationDateOrderByStartTimeAsc(LocalDate date);

    List<Reservation> findByUserEmailOrderByReservationDateDesc(String userEmail);

    List<Reservation> findByUserEmailAndReservationDateGreaterThanEqualOrderByReservationDateAsc(String userEmail, LocalDate date);
}