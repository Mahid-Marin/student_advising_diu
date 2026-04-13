package com.academicatelier.service;

import com.academicatelier.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthService {
    
    private final List<User> users = new ArrayList<>();

    public AuthService() {
        // Sample users for testing
        User sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setStudentId("STU001");
        sampleUser.setName("John Doe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPassword("password123"); // Note: In production, this should be hashed
        sampleUser.setMajor("Computer Science");
        sampleUser.setYear("2nd Year");
        sampleUser.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        users.add(sampleUser);
    }

    /**
     * Register a new user
     */
    public User register(User user) {
        // Check if email already exists
        if (users.stream().anyMatch(u -> u.getEmail().equals(user.getEmail()))) {
            throw new RuntimeException("Email already registered");
        }

        // Check if studentId already exists
        if (users.stream().anyMatch(u -> u.getStudentId().equals(user.getStudentId()))) {
            throw new RuntimeException("Student ID already registered");
        }

        // Set ID and timestamps
        user.setId((long) (users.size() + 1));
        user.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        user.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        users.add(user);
        return user;
    }

    /**
     * Authenticate user and return token
     */
    public User authenticate(String email, String password) {
        Optional<User> user = users.stream()
            .filter(u -> u.getEmail().equals(email) && u.getPassword().equals(password))
            .findFirst();

        if (user.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        return user.get();
    }

    /**
     * Get user by ID
     */
    public User getUser(Long userId) {
        Optional<User> user = users.stream()
            .filter(u -> u.getId().equals(userId))
            .findFirst();

        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        return user.get();
    }

    /**
     * Update user profile
     */
    public User updateProfile(Long userId, User updatedUser) {
        Optional<User> existingUser = users.stream()
            .filter(u -> u.getId().equals(userId))
            .findFirst();

        if (existingUser.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = existingUser.get();
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getMajor() != null) {
            user.setMajor(updatedUser.getMajor());
        }
        if (updatedUser.getYear() != null) {
            user.setYear(updatedUser.getYear());
        }
        user.setUpdatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        return user;
    }
}
