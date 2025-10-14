package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.ActiveOrderDTO;
import com.example.onlinefoodorderingsystem.DTO.DashboardOverviewDTO;
import com.example.onlinefoodorderingsystem.DTO.DashboardStatsDTO;
import com.example.onlinefoodorderingsystem.DTO.UpcomingReservationDTO;
import com.example.onlinefoodorderingsystem.Entity.Order;
import com.example.onlinefoodorderingsystem.Entity.Reservation;
import com.example.onlinefoodorderingsystem.Repository.OrderRepository;
import com.example.onlinefoodorderingsystem.Repository.ReservationRepository;
import com.example.onlinefoodorderingsystem.Service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Override
    public DashboardOverviewDTO getDashboardOverview(String userEmail) {
        // 1. Fetch active orders (not delivered or cancelled)
        List<String> finishedStatuses = Arrays.asList("Delivered", "Completed", "Cancelled");
        List<Order> activeOrderEntities = orderRepository.findByPlacedByAndOrderStatusNotIn(userEmail, finishedStatuses);

        // 2. Fetch upcoming reservations (today or later)
        List<Reservation> upcomingReservationEntities = reservationRepository
                .findByUserEmailAndReservationDateGreaterThanEqualOrderByReservationDateAsc(userEmail, LocalDate.now());

        // 3. Calculate statistics
        long totalOrders = orderRepository.countByPlacedBy(userEmail);
        long activeOrdersCount = activeOrderEntities.size();
        long upcomingReservationsCount = upcomingReservationEntities.size();
        DashboardStatsDTO stats = new DashboardStatsDTO(totalOrders, activeOrdersCount, upcomingReservationsCount);

        // 4. Map entities to simplified DTOs for the frontend
        List<ActiveOrderDTO> activeOrders = activeOrderEntities.stream()
                .map(this::mapToActiveOrderDTO)
                .collect(Collectors.toList());

        List<UpcomingReservationDTO> upcomingReservations = upcomingReservationEntities.stream()
                .map(this::mapToUpcomingReservationDTO)
                .collect(Collectors.toList());

        // 5. Assemble and return the final overview DTO
        return new DashboardOverviewDTO(stats, activeOrders, upcomingReservations);
    }

    /**
     * Helper method to convert an Order entity to a simplified ActiveOrderDTO.
     */
    private ActiveOrderDTO mapToActiveOrderDTO(Order order) {
        String itemsSummary = order.getItems().size() + " item" + (order.getItems().size() > 1 ? "s" : "");
        String time = order.getOrderDateTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
        return new ActiveOrderDTO(
                order.getOrderId(),
                "CraveCorner",
                itemsSummary,
                order.getOrderStatus(),
                time
        );
    }

    /**
     * Helper method to convert a Reservation entity to a simplified UpcomingReservationDTO.
     */
    private UpcomingReservationDTO mapToUpcomingReservationDTO(Reservation res) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("EEE, MMM dd");
        String formattedDate = res.getReservationDate().format(dateFormatter) + " at " + res.getStartTime().format(DateTimeFormatter.ofPattern("hh:mm a"));
        String tableInfo = "Table #" + res.getTable().getId();

        return new UpcomingReservationDTO(
                res.getId(),
                "CraveCorner",
                formattedDate,
                tableInfo,
                res.getNumberOfGuests(),
                "Confirmed"
        );
    }
}