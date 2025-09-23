package com.socialmedia.dto;

import jakarta.validation.constraints.NotBlank;

public class MessageRequest {
    @NotBlank(message = "Recipient email is required")
    private String recipientEmail;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    // Media fields
    private String mediaData;
    private String mediaType;
    private String mediaFilename;
    
    public MessageRequest() {}
    
    public MessageRequest(String recipientEmail, String content) {
        this.recipientEmail = recipientEmail;
        this.content = content;
    }
    
    public String getRecipientEmail() { return recipientEmail; }
    public void setRecipientEmail(String recipientEmail) { this.recipientEmail = recipientEmail; }
    
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    
    public String getMediaData() { return mediaData; }
    public void setMediaData(String mediaData) { this.mediaData = mediaData; }
    
    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }
    
    public String getMediaFilename() { return mediaFilename; }
    public void setMediaFilename(String mediaFilename) { this.mediaFilename = mediaFilename; }
}