package com.example.onlinefoodorderingsystem;

import com.example.onlinefoodorderingsystem.Entity.Staff;
import com.example.onlinefoodorderingsystem.Repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class OnlineFoodOrderingSystemApplication implements CommandLineRunner {

    @Autowired
    private StaffRepository staffRepository;

    public static void main(String[] args) {
        SpringApplication.run(OnlineFoodOrderingSystemApplication.class, args);
    }

    @Override
    public void run(String... args) {
        System.out.println("✅ Application Started. Checking for default accounts...");

        // Create default admin
        if (staffRepository.findByEmail("admin@system.com") == null) {
            Staff admin = new Staff();
            admin.setName("System Admin");
            admin.setEmail("admin@system.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            staffRepository.save(admin);
            System.out.println("🧑‍💼 Test Admin created: admin@system.com / admin123");
        }

        // Create default staff
        if (staffRepository.findByEmail("staff@system.com") == null) {
            Staff staff = new Staff();
            staff.setName("Test Staff");
            staff.setEmail("staff@system.com");
            staff.setPassword("staff123");
            staff.setRole("STAFF");
            staffRepository.save(staff);
            System.out.println("👨‍🍳 Test Staff created: staff@system.com / staff123");
        }

        System.out.println("🚀 Default accounts ready!");
    }
}
