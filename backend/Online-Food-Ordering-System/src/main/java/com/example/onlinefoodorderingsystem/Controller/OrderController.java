package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.OrderDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ... existing endpoints ...

    @PostMapping("/create")
    public ResponseEntity<ResponseDTO> createOrder(
            @RequestParam String placedBy,
            @RequestParam String paymentMethod,
            @RequestParam double totalAmount,
            @RequestParam(required = false) String tableNumber,
            @RequestBody List<String> items
    ) {
        return orderService.createOrder(placedBy, paymentMethod, items, totalAmount, tableNumber);
    }

    @GetMapping("/all")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/today")
    public List<OrderDTO> getTodayOrders() {
        return orderService.getTodayOrders();
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<ResponseDTO> payOrder(@PathVariable Long id, @RequestBody String paymentMethod) {
        return orderService.processPayment(id, paymentMethod);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String riderEmail
    ) {
        return orderService.updateOrderStatus(id, status, riderEmail);
    }

    @PostMapping("/place-from-cart")
    public ResponseEntity<ResponseDTO> placeOrderFromCart(@RequestBody Map<String, String> payload) {
        String userEmail = payload.get("userEmail");
        String paymentMethod = payload.get("paymentMethod");
        String tableNumber = payload.get("tableNumber");
        return orderService.placeOrderFromCart(userEmail, paymentMethod, tableNumber);
    }

    @GetMapping("/rider/{riderEmail}")
    public List<OrderDTO> getRiderOrders(@PathVariable String riderEmail) {
        return orderService.getOrdersForRider(riderEmail);
    }

    @PutMapping("/{id}/assign-rider")
    public ResponseEntity<ResponseDTO> assignRider(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String riderEmail = payload.get("riderEmail");
        return orderService.assignRiderToOrder(id, riderEmail);
    }

    @GetMapping("/available-cod")
    public List<OrderDTO> getAvailableCODOrders() {
        return orderService.getAvailableCODOrders();
    }

    @GetMapping("/history/{userEmail}")
    public List<OrderDTO> getOrderHistory(@PathVariable String userEmail) {
        return orderService.getOrderHistoryForUser(userEmail);
    }

    // --- NEW ENDPOINT for Order Tracking ---
    @GetMapping("/track/{orderId}")
    public ResponseEntity<?> trackOrder(@PathVariable String orderId) {
        // The frontend sends the order ID (e.g., ORD59D9E07D), so we add the '#'
        OrderDTO orderDetails = orderService.findByOrderId("#" + orderId.toUpperCase());

        if (orderDetails == null) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Order not found with ID: #" + orderId)
                            .responseCode(HttpStatus.NOT_FOUND)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }
        return ResponseEntity.ok(orderDetails);
    }
}