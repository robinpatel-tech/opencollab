package com.robintech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String content;
    private String sentAt;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    private MessageType type;
}