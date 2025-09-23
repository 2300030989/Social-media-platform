package com.socialmedia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Sender email is required")
    @Column(name = "sender_email")
    private String senderEmail;
    
    @NotBlank(message = "Recipient email is required")
    @Column(name = "recipient_email")
    private String recipientEmail;
    
    @NotBlank(message = "Content is required")
    @Column(length = 1000)
    private String content;
    
    private LocalDateTime timestamp;
    
    @Column(name = "is_read")
    private boolean read = false;
    
    private boolean deleted = false;
    
    // Media attachment (stored as base64)
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String mediaData;
    
    private String mediaType;
    private String mediaFilename;
    
    // Constructors
    public Message() {
        this.timestamp = LocalDateTime.now();
    }
    
    public Message(String senderEmail, String recipientEmail, String content) {
        this();
        this.senderEmail = senderEmail;
        this.recipientEmail = recipientEmail;
        this.content = content;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSenderEmail() { return senderEmail; }
    public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
    
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
    
    public boolean isDeleted() { return deleted; }
    public void setDeleted(boolean deleted) { this.deleted = deleted; }
    
    public String getMediaData() { return mediaData; }
    public void setMediaData(String mediaData) { this.mediaData = mediaData; }
    
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    
    public String getMediaFilename() { return mediaFilename; }
    public void setMediaFilename(String mediaFilename) { this.mediaFilename = mediaFilename; }
}