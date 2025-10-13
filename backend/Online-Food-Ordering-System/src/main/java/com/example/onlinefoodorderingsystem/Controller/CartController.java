package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.CartItemDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/cart")
@CrossOrigin
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<ResponseDTO> addToCart(@RequestBody CartItemDTO cartItemDTO) {
        return cartService.addToCart(cartItemDTO);
    }

    @GetMapping("/{userEmail}")
    public ResponseEntity<List<CartItemDTO>> getCartItems(@PathVariable String userEmail) {
        return cartService.getCartItems(userEmail);
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ResponseDTO> updateCartItem(@PathVariable Long cartItemId, @RequestBody Map<String, Integer> payload) {
        return cartService.updateCartItemQuantity(cartItemId, payload.get("quantity"));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ResponseDTO> removeCartItem(@PathVariable Long cartItemId) {
        return cartService.removeCartItem(cartItemId);
    }
}