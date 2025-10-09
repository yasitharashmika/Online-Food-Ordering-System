package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.OrderDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

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

    // ✅ New endpoint: update order status (for kitchen or cashier)
    @PutMapping("/{id}/status")
    public ResponseEntity<ResponseDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }
}
