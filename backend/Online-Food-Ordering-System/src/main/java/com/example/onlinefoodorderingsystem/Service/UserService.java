package com.example.onlinefoodorderingsystem.Service;

import com.example.onlinefoodorderingsystem.DTO.LoginDTO;
import com.example.onlinefoodorderingsystem.DTO.ResponseDTO;
import com.example.onlinefoodorderingsystem.DTO.UserDTO;
import org.springframework.http.ResponseEntity;

public interface UserService {
    ResponseEntity<ResponseDTO> registerUser(UserDTO userDTO);
    ResponseEntity<ResponseDTO> loginUser(LoginDTO loginDTO);
}
