package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // Find all items in a user's cart
    List<CartItem> findByUserEmail(String userEmail);

    // Find a specific item in a user's cart to check for duplicates
    Optional<CartItem> findByFoodItemIdAndUserEmail(Long foodItemId, String userEmail);

    // Clear a user's cart after an order is placed
    void deleteByUserEmail(String userEmail);
}