package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.UserDTO;
import com.example.onlinefoodorderingsystem.Entity.User;
import com.example.onlinefoodorderingsystem.Repository.UserRepository;
import com.example.onlinefoodorderingsystem.Service.EmailService;
import com.example.onlinefoodorderingsystem.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import com.example.onlinefoodorderingsystem.Entity.PasswordResetToken;
import com.example.onlinefoodorderingsystem.Repository.PasswordResetTokenRepository;
import java.time.LocalDateTime;
import java.util.Random;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    @Autowired
    private EmailService emailService;

    @Override
    public ResponseEntity<ResponseDTO> registerUser(UserDTO userDTO) {
        try {
            String normalizedEmail = userDTO.getEmail().toLowerCase();
            boolean exists = userRepository.findAll()
                    .stream()
                    .anyMatch(u -> u.getEmail().equals(normalizedEmail));
            if (exists) {
                return new ResponseEntity<>(ResponseDTO.builder()
                        .message("Email already registered: " + userDTO.getEmail())
                        .responseCode(HttpStatus.CONFLICT)
                        .build(), HttpStatus.CONFLICT);
            }

            User user = new User();
            user.setName(userDTO.getName());
            user.setEmail(normalizedEmail);
            user.setPassword(userDTO.getPassword());

            userRepository.save(user);

            return new ResponseEntity<>(ResponseDTO.builder()
                    .data(userDTO)
                    .message("User registered successfully")
                    .responseCode(HttpStatus.CREATED)
                    .build(), HttpStatus.CREATED);

        } catch (Exception e) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Failed to register user: " + e.getMessage())
                    .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ResponseDTO> loginUser(LoginDTO loginDTO) {
        try {
            String normalizedEmail = loginDTO.getEmail().toLowerCase();
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

    @Override
    public ResponseEntity<ResponseDTO> forgotPassword(String email) {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("No user found with this email.")
                    .responseCode(HttpStatus.NOT_FOUND)
                    .build(), HttpStatus.NOT_FOUND);
        }

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            token = new PasswordResetToken();
            token.setEmail(email.toLowerCase());
        }
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(token);

        emailService.sendOtpEmail(email, otp);

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("OTP is being sent to your email.")
                .responseCode(HttpStatus.OK)
                .build(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResponseDTO> verifyOtp(String email, String otp) {
        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("No OTP found for this email.")
                    .responseCode(HttpStatus.NOT_FOUND)
                    .build(), HttpStatus.NOT_FOUND);
        }

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("OTP expired. Please request a new one.")
                    .responseCode(HttpStatus.BAD_REQUEST)
                    .build(), HttpStatus.BAD_REQUEST);
        }

        if (!token.getOtp().equals(otp)) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Invalid OTP. Try again.")
                    .responseCode(HttpStatus.BAD_REQUEST)
                    .build(), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("OTP verified successfully.")
                .responseCode(HttpStatus.OK)
                .build(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<ResponseDTO> resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email.toLowerCase());
        if (user == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("User not found.")
                    .responseCode(HttpStatus.NOT_FOUND)
                    .build(), HttpStatus.NOT_FOUND);
        }

        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("No valid OTP found.")
                    .responseCode(HttpStatus.BAD_REQUEST)
                    .build(), HttpStatus.BAD_REQUEST);
        }

        user.setPassword(newPassword);
        userRepository.save(user);

        tokenRepository.delete(token);

        return new ResponseEntity<>(ResponseDTO.builder()
                .message("Password reset successfully.")
                .responseCode(HttpStatus.OK)
                .build(), HttpStatus.OK);
    }

    // ✅ New method: fetch all users
    @Override
    public ResponseEntity<ResponseDTO> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            return new ResponseEntity<>(ResponseDTO.builder()
                    .data(users)
                    .message("Users fetched successfully")
                    .responseCode(HttpStatus.OK)
                    .build(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(ResponseDTO.builder()
                    .message("Failed to fetch users: " + e.getMessage())
                    .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
