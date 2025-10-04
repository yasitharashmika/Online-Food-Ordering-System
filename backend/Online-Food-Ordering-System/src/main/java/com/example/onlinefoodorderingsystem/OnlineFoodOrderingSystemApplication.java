package com.example.onlinefoodorderingsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class OnlineFoodOrderingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlineFoodOrderingSystemApplication.class, args);
    }

}
