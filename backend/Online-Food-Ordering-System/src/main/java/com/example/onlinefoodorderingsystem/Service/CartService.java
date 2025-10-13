package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.CartItemDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CartService {
    ResponseEntity<ResponseDTO> addToCart(CartItemDTO cartItemDTO);
    ResponseEntity<List<CartItemDTO>> getCartItems(String userEmail);
    ResponseEntity<ResponseDTO> updateCartItemQuantity(Long cartItemId, int quantity);
    ResponseEntity<ResponseDTO> removeCartItem(Long cartItemId);
}