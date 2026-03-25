package com.robintech.backend.repository;

import com.robintech.backend.model.Message;
import com.robintech.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("SELECT m FROM Message m WHERE " +
            "(m.sender = :user1 AND m.receiver = :user2) OR " +
            "(m.sender = :user2 AND m.receiver = :user1) " +
            "ORDER BY m.sentAt ASC")
    List<Message> findConversation(
            @Param("user1") User user1,
            @Param("user2") User user2
    );

    @Query("SELECT m FROM Message m WHERE " +
            "m.receiver = :user AND m.isRead = false")
    List<Message> findUnreadMessages(@Param("user") User user);
}