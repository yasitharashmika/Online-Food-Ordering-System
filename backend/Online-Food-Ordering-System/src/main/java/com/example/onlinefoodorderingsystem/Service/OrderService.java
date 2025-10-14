package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.OrderDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface OrderService {
    ResponseEntity<ResponseDTO> createOrder(String placedBy, String paymentMethod,
                                            List<String> items, double totalAmount, String tableNumber);
    List<OrderDTO> getAllOrders();
    List<OrderDTO> getTodayOrders();
    ResponseEntity<ResponseDTO> processPayment(Long id, String paymentMethod);
    ResponseEntity<ResponseDTO> updateOrderStatus(Long id, String status, String riderEmail);
    ResponseEntity<ResponseDTO> placeOrderFromCart(String userEmail, String paymentMethod, String tableNumber);
    ResponseEntity<ResponseDTO> assignRiderToOrder(Long orderId, String riderEmail);
    List<OrderDTO> getOrdersForRider(String riderEmail);
    List<OrderDTO> getAvailableCODOrders();
    List<OrderDTO> getOrderHistoryForUser(String userEmail);

    // --- NEW METHOD for Order Tracking ---
    /**
     * Finds an order by its unique string ID (e.g., #ORD12345).
     * @param orderId The string ID of the order.
     * @return The OrderDTO if found, otherwise null.
     */
    OrderDTO findByOrderId(String orderId);
}