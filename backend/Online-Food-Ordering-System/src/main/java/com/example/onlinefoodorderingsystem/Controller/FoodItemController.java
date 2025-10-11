package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.Entity.FoodItem;
import com.example.onlinefoodorderingsystem.Service.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/menu")
@CrossOrigin
public class FoodItemController {

    @Autowired
    private FoodItemService foodItemService;

    // Updated upload directory (relative to project root)
    private final String uploadDir = new File("uploads").getAbsolutePath() + "/";

    @GetMapping("/all")
    public List<FoodItem> getAllFoodItems() {
        return foodItemService.getAllFoodItems();
    }

    @PostMapping("/add")
    public FoodItem addFoodItem(@RequestParam String name,
                                @RequestParam Double price,
                                @RequestParam String category,
                                @RequestParam(required = false) String description,
                                @RequestParam(required = false) MultipartFile image) throws IOException {

        FoodItem item = new FoodItem();
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
        item.setDescription(description);

        if (image != null && !image.isEmpty()) {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // create uploads folder if it doesn't exist
            }

            // Generate a safe filename
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename().replaceAll("\\s+", "_");
            File file = new File(dir, filename);
            image.transferTo(file);

            // Store relative path for frontend
            item.setImageUrl("/uploads/" + filename);
        }

        return foodItemService.addFoodItem(item);
    }

    @PutMapping("/{id}")
    public FoodItem updateFoodItem(@PathVariable Long id,
                                   @RequestParam String name,
                                   @RequestParam Double price,
                                   @RequestParam String category,
                                   @RequestParam(required = false) String description,
                                   @RequestParam(required = false) MultipartFile image) throws IOException {

        FoodItem item = new FoodItem();
        item.setName(name);
        item.setPrice(price);
        item.setCategory(category);
        item.setDescription(description);

        if (image != null && !image.isEmpty()) {
            File dir = new File(uploadDir);
            if (!dir.exists()) {
                dir.mkdirs(); // create uploads folder if it doesn't exist
            }

            // Generate a safe filename
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename().replaceAll("\\s+", "_");
            File file = new File(dir, filename);
            image.transferTo(file);

            item.setImageUrl("/uploads/" + filename);
        }

        return foodItemService.updateFoodItem(id, item);
    }

    @DeleteMapping("/{id}")
    public void deleteFoodItem(@PathVariable Long id) {
        foodItemService.deleteFoodItem(id);
    }
}
