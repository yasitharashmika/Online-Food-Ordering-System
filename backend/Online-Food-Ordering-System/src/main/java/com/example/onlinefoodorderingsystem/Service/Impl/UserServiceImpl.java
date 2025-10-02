package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.UserDTO;
import com.example.onlinefoodorderingsystem.Entity.User;
import com.example.onlinefoodorderingsystem.Repository.UserRepository;
import com.example.onlinefoodorderingsystem.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public ResponseEntity<ResponseDTO> registerUser(UserDTO userDTO) {
        try {
            // Normalize email to lowercase
            String normalizedEmail = userDTO.getEmail().toLowerCase();

            // Check if email already exists
            boolean exists = userRepository.findAll()
                    .stream()
                    .anyMatch(u -> u.getEmail().equals(normalizedEmail));
            if (exists) {
                return new ResponseEntity<>(ResponseDTO.builder()
                        .message("Email already registered: " + userDTO.getEmail())
                        .responseCode(HttpStatus.CONFLICT)
                        .build(), HttpStatus.CONFLICT);
            }

            // Convert DTO to Entity
            User user = new User();
            user.setName(userDTO.getName());
            user.setEmail(normalizedEmail); // ✅ save lowercase
            user.setPassword(userDTO.getPassword()); // NOTE: plain text, not safe for production

            userRepository.save(user);

            // Return success response
            return new ResponseEntity<>(ResponseDTO.builder()
                    .data(userDTO)
                    .message("User registered successfully")
                    .responseCode(HttpStatus.CREATED)
                    .build(), HttpStatus.CREATED);

        } catch (Exception e) {
            // Handle error
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Failed to register user: " + e.getMessage())
                    .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ResponseDTO> loginUser(LoginDTO loginDTO) {
        try {
            // Normalize email to lowercase
            String normalizedEmail = loginDTO.getEmail().toLowerCase();

            // Find user
            User user = userRepository.findAll()
                    .stream()
                    .filter(u -> u.getEmail().equals(normalizedEmail) &&
                            u.getPassword().equals(loginDTO.getPassword()))
                    .findFirst()
                    .orElse(null);

            if (user != null) {
                return new ResponseEntity<>(ResponseDTO.builder()
                        .data(user.getName())
                        .message("Login successful")
                        .responseCode(HttpStatus.OK)
                        .build(), HttpStatus.OK);
            } else {
                return new ResponseEntity<>(ResponseDTO.builder()
                        .message("Invalid email or password")
                        .responseCode(HttpStatus.UNAUTHORIZED)
                        .build(), HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Error during login: " + e.getMessage())
                    .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
