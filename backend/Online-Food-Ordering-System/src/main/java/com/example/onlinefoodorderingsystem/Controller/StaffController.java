package com.example.onlinefoodorderingsystem.Controller;

import com.example.onlinefoodorderingsystem.DTO.ForgotPasswordDTO;
import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.Service.StaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/staff")
@CrossOrigin
public class StaffController {

    @Autowired
    private StaffService staffService;

    @PostMapping("/login")
    public ResponseEntity<ResponseDTO> loginStaff(@RequestBody LoginDTO loginDTO) {
        return staffService.loginStaff(loginDTO);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ResponseDTO> forgotPassword(@RequestBody ForgotPasswordDTO request) {
        return staffService.forgotPassword(request.getEmail());
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<ResponseDTO> verifyOtp(@RequestBody ForgotPasswordDTO request) {
        return staffService.verifyOtp(request.getEmail(), request.getOtp());
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody ForgotPasswordDTO request) {
        return staffService.resetPassword(request.getEmail(), request.getNewPassword());
    }

}
