package com.example.onlinefoodorderingsystem.Service.Impl;

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
            // Convert DTO to Entity
            User user = new User();
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());

            // Save password as plain text (not recommended for production!)
            user.setPassword(userDTO.getPassword());

            userRepository.save(user);

            // Return success response
            return new ResponseEntity<>(ResponseDTO.builder()
                    .data(userDTO) // returning same DTO
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
}
