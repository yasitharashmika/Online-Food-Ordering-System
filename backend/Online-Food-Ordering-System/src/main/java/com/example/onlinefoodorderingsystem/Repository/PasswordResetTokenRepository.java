package com.example.onlinefoodorderingsystem.Repository;

import com.example.onlinefoodorderingsystem.Entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByEmail(String email);
}