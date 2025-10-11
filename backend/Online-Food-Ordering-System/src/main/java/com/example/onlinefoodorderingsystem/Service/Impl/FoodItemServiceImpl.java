package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import com.example.onlinefoodorderingsystem.Repository.FoodItemRepository;
import com.example.onlinefoodorderingsystem.Service.FoodItemService;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        FoodItem savedItem = foodItemRepository.save(item);
        ResponseDTO.builder()
                .message("Food item added successfully")
                .data(savedItem)
                .responseCode(HttpStatus.CREATED)
                .build();
        return savedItem;
    }

    @Override
    public FoodItem updateFoodItem(Long id, FoodItem item) {
        Optional<FoodItem> existingOpt = foodItemRepository.findById(id);
        if (existingOpt.isPresent()) {
            FoodItem existing = existingOpt.get();
            existing.setName(item.getName());
            existing.setPrice(item.getPrice());
            existing.setCategory(item.getCategory());
            existing.setDescription(item.getDescription());
            existing.setImageUrl(item.getImageUrl());

            FoodItem updatedItem = foodItemRepository.save(existing);

            ResponseDTO.builder()
                    .message("Food item updated successfully")
                    .data(updatedItem)
                    .responseCode(HttpStatus.OK)
                    .build();

            return updatedItem;
        }
        return null;
    }

    @Override
    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
        ResponseDTO.builder()
                .message("Food item deleted successfully")
                .data(null)
                .responseCode(HttpStatus.OK)
                .build();
    }
}
