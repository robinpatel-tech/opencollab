package com.robintech.backend.controller;

import com.robintech.backend.dto.UserResponse;
import com.robintech.backend.model.User;
import com.robintech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/me")
    public UserResponse getMyProfile() {
        return UserResponse.fromEntity(getCurrentUser());
    }

    @GetMapping("/{id}")
    public UserResponse getUserProfile(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(UserResponse::fromEntity)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PutMapping("/profile")
    @Transactional
    public UserResponse updateProfile(@RequestBody User profileData) {
        User user = getCurrentUser();
        if (profileData.getBio() != null) user.setBio(profileData.getBio());
        if (profileData.getGithubUrl() != null) user.setGithubUrl(profileData.getGithubUrl());
        if (profileData.getAvatarUrl() != null) user.setAvatarUrl(profileData.getAvatarUrl());
        if (profileData.getSkills() != null) user.setSkills(profileData.getSkills());
        
        return UserResponse.fromEntity(userRepository.save(user));
    }
}
