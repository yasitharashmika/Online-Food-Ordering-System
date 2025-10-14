package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.UserDTO;
// --- UPDATE: Import the new DTO ---
import com.example.onlinefoodorderingsystem.DTO.UserProfileDTO;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<ResponseDTO> registerUser(UserDTO userDTO);
    ResponseEntity<ResponseDTO> loginUser(LoginDTO loginDTO);
    ResponseEntity<ResponseDTO> forgotPassword(String email);
    ResponseEntity<ResponseDTO> verifyOtp(String email, String otp);
    ResponseEntity<ResponseDTO> resetPassword(String email, String newPassword);

    // ✅ New method to fetch all users
    ResponseEntity<ResponseDTO> getAllUsers();

    // --- UPDATE START: Add new method signatures for profile management ---
    ResponseEntity<ResponseDTO> getUserProfile(String email);
    ResponseEntity<ResponseDTO> updateUserProfile(String email, UserProfileDTO profileDTO);
    // --- UPDATE END ---
}