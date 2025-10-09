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

    // ✅ New method for updating order status
    ResponseEntity<ResponseDTO> updateOrderStatus(Long id, String status);
}
