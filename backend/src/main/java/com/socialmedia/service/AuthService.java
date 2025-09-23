package com.socialmedia.service;

import com.socialmedia.dto.AuthResponse;
import com.socialmedia.dto.LoginRequest;
import com.socialmedia.dto.SignupRequest;
import com.socialmedia.model.User;
import com.socialmedia.repository.UserRepository;
import com.socialmedia.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public AuthResponse authenticateUser(LoginRequest loginRequest) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found with email: " + loginRequest.getEmail());
        }

        User user = userOptional.get();
        
        if (!user.isActive()) {
            throw new Exception("Account is deactivated. Please contact administrator.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }

        // Generate JWT token with email as the subject
        String jwt = jwtUtils.generateJwtToken(user.getEmail());
        
        // Remove password from response
        user.setPassword(null);
        
        return new AuthResponse(jwt, user);
    }

    public AuthResponse registerUser(SignupRequest signUpRequest) throws Exception {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new Exception("Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new Exception("Email is already in use!");
        }

        // Create new user account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setDisplayName(signUpRequest.getDisplayName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        // Set default avatar
        user.setAvatar("https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150");
        user.setBio("New member of this community");

        User savedUser = userRepository.save(user);
        
        // Generate JWT token with email as the subject
        String jwt = jwtUtils.generateJwtToken(savedUser.getEmail());
        
        // Remove password from response
        savedUser.setPassword(null);
        
        return new AuthResponse(jwt, savedUser);
    }

    public User getCurrentUser(String token) throws Exception {
        try {
            String jwt = token.replace("Bearer ", "");
            String userEmail = jwtUtils.getUserIdFromJwtToken(jwt);
            
            if (userEmail == null || userEmail.trim().isEmpty()) {
                throw new Exception("Invalid token: no email found");
            }
            
            Optional<User> userOptional = userRepository.findByEmail(userEmail);
            if (userOptional.isEmpty()) {
                throw new Exception("User not found with email: " + userEmail);
            }

            User user = userOptional.get();
            if (!user.isActive()) {
                throw new Exception("Account is deactivated");
            }
            
            user.setPassword(null); // Remove password from response
            return user;
        } catch (Exception e) {
            throw new Exception("Failed to get current user: " + e.getMessage());
        }
    }
}