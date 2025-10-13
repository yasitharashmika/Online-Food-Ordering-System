package com.example.onlinefoodorderingsystem.config;


import com.example.onlinefoodorderingsystem.Entity.RestaurantTable;
import com.example.onlinefoodorderingsystem.Repository.RestaurantTableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RestaurantTableRepository tableRepository;

    @Override
    public void run(String... args) throws Exception {
        // This code will run once on application startup
        // We check if the table is empty before adding data
        if (tableRepository.count() == 0) {
            System.out.println("No table data found. Initializing restaurant tables...");

            // Create and save each table entity
            createTable(4, "main", "standard");
            createTable(4, "main", "standard");
            createTable(4, "main", "standard");
            createTable(4, "main", "standard");
            createTable(4, "main", "standard");
            createTable(4, "main", "standard");
            createTable(6, "main", "large");
            createTable(6, "main", "large");
            createTable(6, "main", "large");
            createTable(2, "side", "small");
            createTable(2, "side", "small");
            createTable(2, "side", "small");
            createTable(2, "side", "small");
            createTable(2, "side", "small");
            createTable(2, "side", "small");

            System.out.println("Finished initializing table data.");
        } else {
            System.out.println("Table data already exists. Skipping initialization.");
        }
    }

    private void createTable(int seats, String area, String type) {
        RestaurantTable table = new RestaurantTable();
        table.setSeats(seats);
        table.setArea(area);
        table.setType(type);
        tableRepository.save(table);
    }
}