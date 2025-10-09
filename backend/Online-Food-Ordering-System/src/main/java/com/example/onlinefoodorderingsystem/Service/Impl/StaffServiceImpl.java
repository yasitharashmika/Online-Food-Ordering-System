package com.example.onlinefoodorderingsystem.Service.Impl;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Entity.PasswordResetToken;
import com.example.onlinefoodorderingsystem.Entity.Staff;
import com.example.onlinefoodorderingsystem.Repository.StaffRepository;
import com.example.onlinefoodorderingsystem.Repository.PasswordResetTokenRepository;
import com.example.onlinefoodorderingsystem.Service.StaffService;
import com.example.onlinefoodorderingsystem.Service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class StaffServiceImpl implements StaffService {

    @Autowired
    private StaffRepository staffRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public ResponseEntity<ResponseDTO> loginStaff(LoginDTO loginDTO) {
        try {
            String email = loginDTO.getEmail().toLowerCase();
            Staff staff = staffRepository.findByEmail(email);

            if (staff == null) {
                return new ResponseEntity<>(
                        ResponseDTO.builder()
                                .message("No staff found with this email.")
                                .responseCode(HttpStatus.NOT_FOUND)
                                .build(),
                        HttpStatus.NOT_FOUND
                );
            }

            if (!staff.getPassword().equals(loginDTO.getPassword())) {
                return new ResponseEntity<>(
                        ResponseDTO.builder()
                                .message("Invalid password.")
                                .responseCode(HttpStatus.UNAUTHORIZED)
                                .build(),
                        HttpStatus.UNAUTHORIZED
                );
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("role", staff.getRole().toLowerCase());
            responseData.put("name", staff.getName());
            responseData.put("email", staff.getEmail());

            return new ResponseEntity<>(
                    ResponseDTO.builder()
                            .data(responseData)
                            .message("Staff login successful")
                            .responseCode(HttpStatus.OK)
                            .build(),
                    HttpStatus.OK
            );

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

        // Generate OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        // Save or update token
        PasswordResetToken token = tokenRepository.findByEmail(email.toLowerCase());
        if (token == null) {
            token = new PasswordResetToken();
            token.setEmail(email.toLowerCase());
        }
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        tokenRepository.save(token);

        // Send OTP email
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
}
