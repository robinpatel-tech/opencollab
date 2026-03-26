package com.robintech.backend.controller;

import com.robintech.backend.dto.ChatMessage;
import com.robintech.backend.dto.MessageResponse;
import com.robintech.backend.model.Message;
import com.robintech.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageService messageService;

    // WebSocket endpoint — handles real-time messages
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        // Save to database
        Message saved = messageService.saveMessage(
                chatMessage.getSenderId(),
                chatMessage.getReceiverId(),
                chatMessage.getContent()
        );

        chatMessage.setSentAt(saved.getSentAt().toString());
        chatMessage.setType(ChatMessage.MessageType.CHAT);

        // Deliver to receiver's private queue
        messagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverId().toString(),
                "/queue/messages",
                chatMessage
        );

        // Also send back to sender so they see their own message
        messagingTemplate.convertAndSendToUser(
                chatMessage.getSenderId().toString(),
                "/queue/messages",
                chatMessage
        );
    }

    // REST endpoint — load chat history
    @GetMapping("/api/messages/{otherUserId}")
    public List<MessageResponse> getConversation(@PathVariable Long otherUserId) {
        return messageService.getConversation(otherUserId);
    }

    // REST endpoint — get unread message count
    @GetMapping("/api/messages/unread")
    public List<MessageResponse> getUnread() {
        return messageService.getUnreadMessages();
    }
}
