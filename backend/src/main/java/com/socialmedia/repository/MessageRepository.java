package com.socialmedia.repository;

import com.socialmedia.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE ((m.senderEmail = :email1 AND m.recipientEmail = :email2) OR (m.senderEmail = :email2 AND m.recipientEmail = :email1)) AND m.deleted = false ORDER BY m.timestamp")
    List<Message> findConversationBetweenUsers(@Param("email1") String email1, @Param("email2") String email2);
    
    @Query("SELECT m FROM Message m WHERE (m.senderEmail = :email OR m.recipientEmail = :email) AND m.deleted = false ORDER BY m.timestamp DESC")
    List<Message> findAllUserMessages(@Param("email") String email);
    
    @Query("SELECT m FROM Message m WHERE m.recipientEmail = :email AND m.read = false AND m.deleted = false")
    List<Message> findUnreadMessages(@Param("email") String email);
    
    @Query("SELECT m FROM Message m WHERE m.recipientEmail = :email AND m.deleted = false")
    List<Message> findReceivedMessages(@Param("email") String email);
    
    @Query("SELECT m FROM Message m WHERE m.senderEmail = :email AND m.deleted = false")
    List<Message> findSentMessages(@Param("email") String email);
}