package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.StaffDTO;
import com.example.onlinefoodorderingsystem.Entity.PasswordResetToken;
import com.example.onlinefoodorderingsystem.Entity.Staff;
import com.example.onlinefoodorderingsystem.Repository.StaffRepository;
import com.example.onlinefoodorderingsystem.Repository.PasswordResetTokenRepository;
import com.example.onlinefoodorderingsystem.Service.EmailService;
import com.example.onlinefoodorderingsystem.Service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
// --- UPDATE: Import the new LoginResponseDTO ---
import com.example.onlinefoodorderingsystem.DTO.LoginResponseDTO;


import java.time.LocalDateTime;
import java.util.*;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    // --- UPDATE: This method now returns the LoginResponseDTO with a token ---
    @Override
    public ResponseEntity<ResponseDTO> loginStaff(LoginDTO loginDTO) {
        try {
            String email = loginDTO.getEmail().toLowerCase();
            Staff staff = staffRepository.findByEmail(email);

            if (staff != null && staff.getPassword().equals(loginDTO.getPassword())) {
                // In a production app, generate a secure JWT token.
                String token = "fake-jwt-token-for-staff-" + staff.getId();

                LoginResponseDTO loginResponse = LoginResponseDTO.builder()
                        .token(token)
                        .id(staff.getId())
                        .name(staff.getName())
                        .email(staff.getEmail())
                        .role(staff.getRole())
                        .build();

                return new ResponseEntity<>(
                        ResponseDTO.builder()
                                .data(loginResponse)
                                .message("Staff login successful")
                                .responseCode(HttpStatus.OK)
                                .build(),
                        HttpStatus.OK
                );
            } else {
                return new ResponseEntity<>(
                        ResponseDTO.builder()
                                .message("Invalid email or password.")
                                .responseCode(HttpStatus.UNAUTHORIZED)
                                .build(),
                        HttpStatus.UNAUTHORIZED
                );
            }

        } catch (Exception e) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Error during login: " + e.getMessage())
                            .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    public ResponseEntity<ResponseDTO> forgotPassword(String email) {
        Staff staff = staffRepository.findByEmail(email.toLowerCase());
        if (staff == null) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("No staff found with this email.")
                            .responseCode(HttpStatus.NOT_FOUND)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
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

        return new ResponseEntity<>(
                ResponseDTO.builder()
                        .message("OTP is being sent to your email.")
                        .responseCode(HttpStatus.OK)
                        .build(),
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<ResponseDTO> verifyOtp(String email, String otp) {
        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("No OTP found for this email.")
                            .responseCode(HttpStatus.NOT_FOUND)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("OTP expired. Please request a new one.")
                            .responseCode(HttpStatus.BAD_REQUEST)
                            .build(),
                    HttpStatus.BAD_REQUEST
            );
        }

        if (!token.getOtp().equals(otp)) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Invalid OTP. Try again.")
                            .responseCode(HttpStatus.BAD_REQUEST)
                            .build(),
                    HttpStatus.BAD_REQUEST
            );
        }

        return new ResponseEntity<>(
                ResponseDTO.builder()
                        .message("OTP verified successfully.")
                        .responseCode(HttpStatus.OK)
                        .build(),
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<ResponseDTO> resetPassword(String email, String newPassword) {
        Staff staff = staffRepository.findByEmail(email.toLowerCase());
        if (staff == null) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Staff not found.")
                            .responseCode(HttpStatus.NOT_FOUND)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }

        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("No valid OTP found.")
                            .responseCode(HttpStatus.BAD_REQUEST)
                            .build(),
                    HttpStatus.BAD_REQUEST
            );
        }

        staff.setPassword(newPassword);
        staffRepository.save(staff);

        tokenRepository.delete(token);

        return new ResponseEntity<>(
                ResponseDTO.builder()
                        .message("Password reset successfully.")
                        .responseCode(HttpStatus.OK)
                        .build(),
                HttpStatus.OK
        );
    }

    @Override
    public ResponseEntity<ResponseDTO> registerStaff(StaffDTO staffDTO) {
        try {
            String email = staffDTO.getEmail().toLowerCase();
            if (staffRepository.findByEmail(email) != null) {
                return new ResponseEntity<>(
                        ResponseDTO.builder()
                                .message("Email already registered")
                                .responseCode(HttpStatus.CONFLICT)
                                .build(),
                        HttpStatus.CONFLICT
                );
            }

            Staff staff = new Staff();
            staff.setName(staffDTO.getName());
            staff.setEmail(email);
            staff.setPassword(staffDTO.getPassword());
            staff.setRole(staffDTO.getRole());

            staffRepository.save(staff);

            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .data(staffDTO)
                            .message("Staff registered successfully")
                            .responseCode(HttpStatus.CREATED)
                            .build(),
                    HttpStatus.CREATED
            );
        } catch (Exception e) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Failed to register staff: " + e.getMessage())
                            .responseCode(HttpStatus.INTERNAL_SERVER_ERROR)
                            .build(),
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    @Override
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Override
    public ResponseEntity<ResponseDTO> deleteStaff(int id) {
        Optional<Staff> staffOptional = staffRepository.findById(id);
        if (staffOptional.isEmpty()) {
            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .message("Staff not found")
                            .responseCode(HttpStatus.NOT_FOUND)
                            .build(),
                    HttpStatus.NOT_FOUND
            );
        }

        staffRepository.deleteById(id);
        return new ResponseEntity<>(
                ResponseDTO.builder()
                        .message("Staff deleted successfully")
                        .responseCode(HttpStatus.OK)
                        .build(),
                HttpStatus.OK
        );
    }
}