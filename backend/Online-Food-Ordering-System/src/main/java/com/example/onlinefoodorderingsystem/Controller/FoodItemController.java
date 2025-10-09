package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import com.example.onlinefoodorderingsystem.Service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/food")
@CrossOrigin
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    @GetMapping
    public List<FoodItem> getAllFoodItems() {
        return foodItemService.getAllFoodItems();
    }

    @PostMapping
    public FoodItem addFoodItem(@RequestBody FoodItem item) {
        return foodItemService.addFoodItem(item);
    }
}
