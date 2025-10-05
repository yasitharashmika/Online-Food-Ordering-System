package com.example.onlinefoodorderingsystem.DTO;

import lombok.Data;

@Data
public class ForgotPasswordDTO {
    private String email;
    private String otp;
    private String newPassword;
}