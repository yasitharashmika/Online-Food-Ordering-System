package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.StaffDTO;
import com.example.onlinefoodorderingsystem.Entity.Staff;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface StaffService {
    ResponseEntity<ResponseDTO> loginStaff(LoginDTO loginDTO);
    ResponseEntity<ResponseDTO> forgotPassword(String email);
    ResponseEntity<ResponseDTO> verifyOtp(String email, String otp);
    ResponseEntity<ResponseDTO> resetPassword(String email, String newPassword);

    // ✅ New
    ResponseEntity<ResponseDTO> registerStaff(StaffDTO staffDTO);
    List<Staff> getAllStaff();
    ResponseEntity<ResponseDTO> deleteStaff(int id);
}
