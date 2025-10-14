package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.*; // Import all DTOs
import com.example.onlinefoodorderingsystem.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    // Register a user
    @PostMapping("/register")
    public ResponseEntity<ResponseDTO> registerUser(@RequestBody UserDTO userDTO) {
        return userService.registerUser(userDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> loginUser(@RequestBody LoginDTO loginDTO) {
        return userService.loginUser(loginDTO);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO> forgotPassword(@RequestBody ForgotPasswordDTO request) {
        return userService.forgotPassword(request.getEmail());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseDTO> verifyOtp(@RequestBody ForgotPasswordDTO request) {
        return userService.verifyOtp(request.getEmail(), request.getOtp());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody ForgotPasswordDTO request) {
        return userService.resetPassword(request.getEmail(), request.getNewPassword());
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // --- UPDATE START: New endpoints for profile management ---

    /**
     * Get user profile by email.
     * In a real secure app, you'd get the user from the JWT token instead of the path.
     */
    @GetMapping("/profile/{email}")
    public ResponseEntity<ResponseDTO> getUserProfile(@PathVariable String email) {
        return userService.getUserProfile(email);
    }

    /**
     * Update user profile by email.
     */
    @PutMapping("/profile/{email}")
    public ResponseEntity<ResponseDTO> updateUserProfile(@PathVariable String email, @RequestBody UserProfileDTO profileDTO) {
        return userService.updateUserProfile(email, profileDTO);
    }
    // --- UPDATE END ---
}