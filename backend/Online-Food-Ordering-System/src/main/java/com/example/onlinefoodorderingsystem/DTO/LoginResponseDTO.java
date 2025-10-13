package com.example.onlinefoodorderingsystem.DTO;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDTO {
    private String token;
    private int id;
    private String name;
    private String email;
    private String role;
}