package com.socialmedia.controller;

import com.socialmedia.dto.AuthResponse;
import com.socialmedia.dto.LoginRequest;
import com.socialmedia.dto.SignupRequest;
import com.socialmedia.model.User;
import com.socialmedia.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://localhost:3000"}, maxAge = 3600)
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse authResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        try {
            System.out.println("Signup request received: " + signUpRequest.getEmail());
            
            // Manual validation
            if (signUpRequest.getUsername() == null || signUpRequest.getUsername().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Username is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (signUpRequest.getDisplayName() == null || signUpRequest.getDisplayName().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Display name is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password is required");
                return ResponseEntity.badRequest().body(error);
            }
            
            if (signUpRequest.getPassword().length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password must be at least 6 characters");
                return ResponseEntity.badRequest().body(error);
            }
            
            AuthResponse authResponse = authService.registerUser(signUpRequest);
            System.out.println("User registered successfully: " + authResponse.getUser().getEmail());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("Signup error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            System.out.println("Getting current user with token: " + (token != null ? "present" : "null"));
            User currentUser = authService.getCurrentUser(token);
            System.out.println("Current user found: " + currentUser.getEmail());
            return ResponseEntity.ok(currentUser);
        } catch (Exception e) {
            System.err.println("Get current user error: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}