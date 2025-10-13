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

    // --- NEW METHOD for Customer Order History ---
    List<OrderDTO> getOrderHistoryForUser(String userEmail);
}