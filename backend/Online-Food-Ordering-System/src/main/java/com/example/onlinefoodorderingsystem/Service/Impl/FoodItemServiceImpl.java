package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import com.example.onlinefoodorderingsystem.Repository.FoodItemRepository;
import com.example.onlinefoodorderingsystem.Service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodItemServiceImpl implements FoodItemService {

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Override
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    @Override
    public FoodItem addFoodItem(FoodItem item) {
        return foodItemRepository.save(item);
    }
}
