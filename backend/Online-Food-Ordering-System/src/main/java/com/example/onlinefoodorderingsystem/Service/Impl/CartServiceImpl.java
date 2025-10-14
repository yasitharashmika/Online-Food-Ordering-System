package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.CartItemDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Entity.CartItem;
import com.example.onlinefoodorderingsystem.Repository.CartItemRepository;
import com.example.onlinefoodorderingsystem.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public ResponseEntity<ResponseDTO> addToCart(CartItemDTO cartItemDTO) {
        Optional<CartItem> existingItemOpt = cartItemRepository.findByFoodItemIdAndUserEmail(cartItemDTO.getFoodItemId(), cartItemDTO.getUserEmail());

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            CartItem newCartItem = new CartItem();
            newCartItem.setFoodItemId(cartItemDTO.getFoodItemId());
            newCartItem.setName(cartItemDTO.getName());
            newCartItem.setPrice(cartItemDTO.getPrice());
            newCartItem.setQuantity(cartItemDTO.getQuantity());
            newCartItem.setUserEmail(cartItemDTO.getUserEmail());
            cartItemRepository.save(newCartItem);
        }
        return ResponseEntity.ok(ResponseDTO.builder().message("Item added to cart").responseCode(HttpStatus.OK).build());
    }

    @Override
    public ResponseEntity<List<CartItemDTO>> getCartItems(String userEmail) {
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);
        List<CartItemDTO> dtos = cartItems.stream().map(this::mapToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @Override
    public ResponseEntity<ResponseDTO> updateCartItemQuantity(Long cartItemId, int quantity) {
        Optional<CartItem> cartItemOpt = cartItemRepository.findById(cartItemId);
        if (cartItemOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ResponseDTO.builder().message("Item not found in cart").build());
        }
        CartItem item = cartItemOpt.get();
        if (quantity <= 0) {
            cartItemRepository.delete(item);
            return ResponseEntity.ok(ResponseDTO.builder().message("Item removed from cart").build());
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
            return ResponseEntity.ok(ResponseDTO.builder().message("Cart updated").build());
        }
    }

    @Override
    public ResponseEntity<ResponseDTO> removeCartItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return ResponseEntity.ok(ResponseDTO.builder().message("Item removed from cart").build());
    }

    // --- UPDATE: Ensure the 'id' from the entity is mapped to the DTO ---
    private CartItemDTO mapToDTO(CartItem cartItem) {
        return new CartItemDTO(
                cartItem.getId(), // This line is crucial
                cartItem.getFoodItemId(),
                cartItem.getName(),
                cartItem.getPrice(),
                cartItem.getQuantity(),
                cartItem.getUserEmail()
        );
    }
}