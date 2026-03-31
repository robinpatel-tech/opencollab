package com.robintech.backend.controller;

import com.robintech.backend.dto.NotificationResponse;
import com.robintech.backend.model.User;
import com.robintech.backend.repository.UserRepository;
import com.robintech.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<NotificationResponse> getMyNotifications() {
        return notificationService.getMyNotifications(getCurrentUser());
    }

    @GetMapping("/unread-count")
    public long getUnreadCount() {
        return notificationService.getUnreadCount(getCurrentUser());
    }

    @PostMapping("/mark-read")
    public void markAllAsRead() {
        notificationService.markAllAsRead(getCurrentUser());
    }
}
