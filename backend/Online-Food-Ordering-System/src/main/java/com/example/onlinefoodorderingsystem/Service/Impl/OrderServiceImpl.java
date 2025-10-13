package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.OrderDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Entity.CartItem;
import com.example.onlinefoodorderingsystem.Entity.Order;
import com.example.onlinefoodorderingsystem.Entity.User;
import com.example.onlinefoodorderingsystem.Repository.CartItemRepository;
import com.example.onlinefoodorderingsystem.Repository.OrderRepository;
import com.example.onlinefoodorderingsystem.Repository.StaffRepository;
import com.example.onlinefoodorderingsystem.Repository.UserRepository;
import com.example.onlinefoodorderingsystem.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private StaffRepository staffRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<ResponseDTO> createOrder(String placedBy, String paymentMethod, List<String> items, double totalAmount, String tableNumber) {
        // ... existing code ...
        try {
            Order order = new Order();
            order.setOrderId("#ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            order.setOrderDateTime(LocalDateTime.now());
            order.setPlacedBy(placedBy);
            order.setPaymentMethod(paymentMethod);
            order.setItems(items);
            order.setTotalAmount(totalAmount);
            order.setTableNumber(tableNumber);
            order.setOrderStatus("Ready To Prepare");
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
        // ... existing code ...
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

    @Override
    public ResponseEntity<ResponseDTO> updateOrderStatus(Long id, String status, String riderEmail) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseDTO.builder().message("Order not found").responseCode(HttpStatus.NOT_FOUND).build()
            );
        }

        if ("Picked Up".equalsIgnoreCase(status)) {
            if (riderEmail != null && !riderEmail.isEmpty()) {
                order.setAssignedRider(riderEmail);
            }
        }
        // --- UPDATE: Set delivery timestamp when status is "Delivered" ---
        if ("Delivered".equalsIgnoreCase(status)) {
            order.setDeliveredAt(LocalDateTime.now());
        }

        order.setOrderStatus(status);
        orderRepository.save(order);

        return ResponseEntity.ok(ResponseDTO.builder()
                .message("Order status updated to " + status)
                .data(mapToDTO(order))
                .responseCode(HttpStatus.OK)
                .build());
    }

    @Override
    @Transactional
    public ResponseEntity<ResponseDTO> placeOrderFromCart(String userEmail, String paymentMethod, String tableNumber) {
        // ... existing code ...
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);
        if (cartItems.isEmpty()) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Your cart is empty.")
                    .responseCode(HttpStatus.BAD_REQUEST).build(), HttpStatus.BAD_REQUEST);
        }

        double totalAmount = cartItems.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
        List<String> orderItems = cartItems.stream()
                .map(item -> item.getQuantity() + " x " + item.getName())
                .collect(Collectors.toList());

        Order order = new Order();
        order.setOrderId("#ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setOrderDateTime(LocalDateTime.now());
        order.setPlacedBy(userEmail);
        order.setPaymentMethod(paymentMethod);
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setTableNumber(tableNumber);
        order.setOrderStatus("Ready To Prepare");
        orderRepository.save(order);
        cartItemRepository.deleteByUserEmail(userEmail);

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("Order placed successfully! Order ID: " + order.getOrderId())
                .data(mapToDTO(order))
                .responseCode(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<ResponseDTO> assignRiderToOrder(Long orderId, String riderEmail) {
        // ... existing code ...
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseDTO.builder().message("Order not found").responseCode(HttpStatus.NOT_FOUND).build()
            );
        }
        order.setAssignedRider(riderEmail);
        orderRepository.save(order);
        return ResponseEntity.ok(ResponseDTO.builder()
                .message("Rider assigned successfully to order " + order.getOrderId())
                .data(mapToDTO(order))
                .responseCode(HttpStatus.OK)
                .build());
    }

    @Override
    public List<OrderDTO> getOrdersForRider(String riderEmail) {
        // ... existing code ...
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        List<Order> orders = orderRepository.findOrdersForRiderDashboard(riderEmail, startOfDay);
        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDTO> getAvailableCODOrders() {
        // ... existing code ...
        return orderRepository.findAll().stream()
                .filter(o -> "COD".equalsIgnoreCase(o.getPaymentMethod())
                        && "Ready".equalsIgnoreCase(o.getOrderStatus())
                        && o.getAssignedRider() == null)
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // --- NEW METHOD IMPLEMENTATION for Customer Order History ---
    @Override
    public List<OrderDTO> getOrderHistoryForUser(String userEmail) {
        List<Order> orders = orderRepository.findByPlacedByOrderByOrderDateTimeDesc(userEmail);
        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO mapToDTO(Order order) {
        // ... existing code ...
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderId(order.getOrderId());
        dto.setOrderDateTime(order.getOrderDateTime());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setPlacedBy(order.getPlacedBy());
        dto.setTableNumber(order.getTableNumber());
        dto.setItems(order.getItems());
        dto.setAssignedRider(order.getAssignedRider());

        User customer = userRepository.findByEmail(order.getPlacedBy());
        if (customer != null) {
            dto.setCustomerName(customer.getName());
            dto.setCustomerPhone(customer.getPhone());
            dto.setCustomerStreet(customer.getStreet());
            dto.setCustomerCity(customer.getCity());
            dto.setCustomerPostalCode(customer.getPostalCode());
        }
        return dto;
    }
}