package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByOrderId(String orderId);

    // This query is for the Rider Dashboard and remains unchanged
    @Query("SELECT o FROM Order o WHERE " +
            "(o.paymentMethod = 'COD' AND o.orderStatus = 'Ready' AND o.assignedRider IS NULL) OR " +
            "(o.assignedRider = :riderEmail AND o.orderStatus = 'Picked Up') OR " +
            "(o.assignedRider = :riderEmail AND o.orderStatus = 'Delivered' AND o.orderDateTime >= :startOfDay)")
    List<Order> findOrdersForRiderDashboard(@Param("riderEmail") String riderEmail, @Param("startOfDay") LocalDateTime startOfDay);

    // --- NEW METHOD for Customer Order History ---
    // Finds all orders placed by a specific user email, ordered by the most recent date.
    List<Order> findByPlacedByOrderByOrderDateTimeDesc(String userEmail);
}