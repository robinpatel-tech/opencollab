package com.robintech.backend.dto;

import com.robintech.backend.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String bio;
    private String githubUrl;
    private String avatarUrl;
    private java.util.Set<String> skills;

    public static UserResponse fromEntity(User user) {
        if (user == null) return null;
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .githubUrl(user.getGithubUrl())
                .avatarUrl(user.getAvatarUrl())
                .skills(user.getSkills())
                .build();
    }
}
