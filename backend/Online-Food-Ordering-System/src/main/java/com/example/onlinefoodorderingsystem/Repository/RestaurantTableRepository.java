package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {
}