package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import com.example.onlinefoodorderingsystem.Repository.FoodItemRepository;
import com.example.onlinefoodorderingsystem.Service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
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

    /**
     * New method to fetch only items marked as hot deals.
     * @return A list of food items where isHotDeal is true.
     */
    @Override
    public List<FoodItem> getHotDeals() {
        return foodItemRepository.findByIsHotDealTrue();
    }

    @Override
    public FoodItem addFoodItem(FoodItem item) {
        // The isHotDeal property is set in the controller before this method is called.
        return foodItemRepository.save(item);
    }

    @Override
    public FoodItem updateFoodItem(Long id, FoodItem itemDetails) {
        // Find the existing item in the database
        Optional<FoodItem> existingOpt = foodItemRepository.findById(id);

        if (existingOpt.isPresent()) {
            FoodItem existingItem = existingOpt.get();

            // Update fields from the provided itemDetails
            existingItem.setName(itemDetails.getName());
            existingItem.setPrice(itemDetails.getPrice());
            existingItem.setCategory(itemDetails.getCategory());
            existingItem.setDescription(itemDetails.getDescription());

            // ✅ Update the hot deal status
            existingItem.setHotDeal(itemDetails.isHotDeal());

            // Only update the image URL if a new one was actually provided in the request.
            // This prevents accidentally deleting an existing image.
            if (itemDetails.getImageUrl() != null && !itemDetails.getImageUrl().isEmpty()) {
                existingItem.setImageUrl(itemDetails.getImageUrl());
            }

            // Save the updated item back to the database
            return foodItemRepository.save(existingItem);
        }

        // Return null or throw an exception if the item to update was not found
        return null;
    }

    @Override
    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }
}