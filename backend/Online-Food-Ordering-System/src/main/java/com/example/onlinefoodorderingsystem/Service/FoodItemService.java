package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import org.springframework.http.ResponseEntity;
import java.util.List;

public interface FoodItemService {
    List<FoodItem> getAllFoodItems();
    FoodItem addFoodItem(FoodItem item);
}
