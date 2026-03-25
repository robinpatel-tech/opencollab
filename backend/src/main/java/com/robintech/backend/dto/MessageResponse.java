package com.robintech.backend.dto;

import com.robintech.backend.model.Message;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private Long senderId;
    private String senderUsername;
    private Long receiverId;
    private String receiverUsername;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;

    public static MessageResponse fromEntity(Message message) {
        MessageResponse res = new MessageResponse();
        res.setId(message.getId());
        res.setSenderId(message.getSender().getId());
        res.setSenderUsername(message.getSender().getUsername());
        res.setReceiverId(message.getReceiver().getId());
        res.setReceiverUsername(message.getReceiver().getUsername());
        res.setContent(message.getContent());
        res.setRead(message.isRead());
        res.setSentAt(message.getSentAt());
        return res;
    }
}
