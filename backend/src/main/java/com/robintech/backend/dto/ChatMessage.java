package com.robintech.backend.dto;

import lombok.Data;

@Data
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