package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.OrderDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Entity.Order;
import com.example.onlinefoodorderingsystem.Repository.OrderRepository;
import com.example.onlinefoodorderingsystem.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public ResponseEntity<ResponseDTO> createOrder(String placedBy, String paymentMethod, List<String> items, double totalAmount, String tableNumber) {
        try {
            Order order = new Order();
            order.setOrderId("#ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            order.setOrderDateTime(LocalDateTime.now());
            order.setPlacedBy(placedBy);
            order.setPaymentMethod(paymentMethod);
            order.setItems(items);
            order.setTotalAmount(totalAmount);
            order.setTableNumber(tableNumber);
            order.setOrderStatus("Ready To Prepare"); // ✅ default status

            orderRepository.save(order);

            OrderDTO dto = mapToDTO(order);

            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Order placed successfully with ID " + order.getOrderId())
                    .data(dto)
                    .responseCode(HttpStatus.CREATED)
                    .build(), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Error placing order: " + e.getMessage())
                    .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getTodayOrders() {
        LocalDate today = LocalDate.now();
        return orderRepository.findAll().stream()
                .filter(o -> o.getOrderDateTime().toLocalDate().equals(today))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResponseEntity<ResponseDTO> processPayment(Long id, String paymentMethod) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseDTO.builder().message("Order not found").responseCode(HttpStatus.NOT_FOUND).build()
            );
        }

        order.setPaymentMethod(paymentMethod);
        order.setOrderStatus("Completed");
        orderRepository.save(order);

        return ResponseEntity.ok(ResponseDTO.builder()
                .message("Payment processed successfully for order " + order.getOrderId())
                .data(mapToDTO(order))
                .responseCode(HttpStatus.OK)
                .build());
    }

    // ✅ New method for updating order status
    @Override
    public ResponseEntity<ResponseDTO> updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseDTO.builder().message("Order not found").responseCode(HttpStatus.NOT_FOUND).build()
            );
        }

        order.setOrderStatus(status); // Ready To Prepare → Ready → Completed
        orderRepository.save(order);

        return ResponseEntity.ok(ResponseDTO.builder()
                .message("Order status updated to " + status)
                .data(mapToDTO(order))
                .responseCode(HttpStatus.OK)
                .build());
    }

    private OrderDTO mapToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getOrderId(),
                order.getOrderDateTime(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getOrderStatus(),
                order.getPlacedBy(),
                order.getTableNumber(),
                order.getItems()
        );
    }
}
