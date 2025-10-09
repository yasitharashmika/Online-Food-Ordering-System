package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import org.springframework.http.ResponseEntity;

public interface StaffService {
    ResponseEntity<ResponseDTO> loginStaff(LoginDTO loginDTO);
    ResponseEntity<ResponseDTO> forgotPassword(String email);
    ResponseEntity<ResponseDTO> verifyOtp(String email, String otp);
    ResponseEntity<ResponseDTO> resetPassword(String email, String newPassword);
}
