package com.academicatelier.controller;

import com.academicatelier.model.User;
import com.academicatelier.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:3001"})
public class AuthController {
    
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody User user) {
        try {
            User registeredUser = authService.register(user);
            
            // Generate a mock JWT token
            String token = UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("token", token);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("studentId", registeredUser.getStudentId());
            userData.put("id", registeredUser.getId());
            userData.put("name", registeredUser.getName());
            userData.put("email", registeredUser.getEmail());
            userData.put("major", registeredUser.getMajor());
            userData.put("year", registeredUser.getYear());
            response.put("user", userData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    /**
     * Login user
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");
            
            User user = authService.authenticate(email, password);
            
            // Generate a mock JWT token
            String token = UUID.randomUUID().toString();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", token);
            
            Map<String, Object> userData = new HashMap<>();
            userData.put("studentId", user.getStudentId());
            userData.put("id", user.getId());
            userData.put("name", user.getName());
            userData.put("email", user.getEmail());
            userData.put("major", user.getMajor());
            userData.put("year", user.getYear());
            response.put("user", userData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * Get user profile
     */
    @GetMapping("/profile/{studentId}")
    public ResponseEntity<Map<String, Object>> getProfile(@PathVariable String studentId) {
        try {
            // For now, return a mock response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", new HashMap<String, Object>() {{
                put("studentId", studentId);
                put("name", "John Doe");
                put("email", "john@example.com");
                put("major", "Computer Science");
                put("year", "2nd Year");
            }});
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(404).body(response);
        }
    }

    /**
     * Update user profile
     */
    @PutMapping("/profile/{studentId}")
    public ResponseEntity<Map<String, Object>> updateProfile(
            @PathVariable String studentId,
            @RequestBody Map<String, String> updates) {
        try {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("data", updates);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(400).body(response);
        }
    }

    /**
     * Logout user
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
