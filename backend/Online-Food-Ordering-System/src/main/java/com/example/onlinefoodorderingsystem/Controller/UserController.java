package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.ForgotPasswordDTO;
import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.UserDTO;
import com.example.onlinefoodorderingsystem.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/user") // keep as /user
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

    // ✅ New endpoint to fetch all users
    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }
}
