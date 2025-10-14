package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List; // Import List

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    FoodItem findByName(String name);

    // --- NEW METHOD: Find all items marked as hot deals ---
    List<FoodItem> findByIsHotDealTrue();
}