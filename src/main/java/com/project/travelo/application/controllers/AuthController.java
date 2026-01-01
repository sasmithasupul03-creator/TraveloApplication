package com.project.travelo.application.controllers;

import com.project.travelo.model.User;
import com.project.travelo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // CHANGE THIS to whatever secret code you want for admins
    private static final String ADMIN_SECRET_CODE = "TRAVELO_SECRET_2025";

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        // Check if they are trying to be an admin
        if (user.getAdminPasscode() != null && user.getAdminPasscode().equals(ADMIN_SECRET_CODE)) {
            user.setRole("ADMIN");
        } else {
            user.setRole("VISITOR");
            user.setAdminPasscode(null); // Clear invalid passcodes
        }

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully", "role", savedUser.getRole()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<User> user = userRepository.findByEmailAndPassword(email, password);

        if (user.isPresent()) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("name", user.get().getName());
            response.put("role", user.get().getRole());
            response.put("email", user.get().getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        }
    }
}