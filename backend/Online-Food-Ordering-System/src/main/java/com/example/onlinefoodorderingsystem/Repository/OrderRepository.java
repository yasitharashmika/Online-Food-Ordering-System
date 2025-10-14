package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    Order findByOrderId(String orderId);

    @Query("SELECT o FROM Order o WHERE " +
            "(o.paymentMethod = 'COD' AND o.orderStatus = 'Ready' AND o.assignedRider IS NULL) OR " +
            "(o.assignedRider = :riderEmail AND o.orderStatus = 'Picked Up') OR " +
            "(o.assignedRider = :riderEmail AND o.orderStatus = 'Delivered' AND o.orderDateTime >= :startOfDay)")
    List<Order> findOrdersForRiderDashboard(@Param("riderEmail") String riderEmail, @Param("startOfDay") LocalDateTime startOfDay);

    List<Order> findByPlacedByOrderByOrderDateTimeDesc(String userEmail);
    long countByPlacedBy(String userEmail);
    List<Order> findByPlacedByAndOrderStatusNotIn(String userEmail, Collection<String> excludedStatuses);

    // --- NEW METHOD for Reports ---
    /**
     * Finds all orders placed within a given date and time range.
     */
    List<Order> findByOrderDateTimeBetween(LocalDateTime start, LocalDateTime end);
}