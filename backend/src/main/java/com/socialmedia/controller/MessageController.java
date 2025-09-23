package com.socialmedia.controller;

import com.socialmedia.dto.MessageRequest;
import com.socialmedia.model.Message;
import com.socialmedia.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageRequest messageRequest, 
                                       Authentication authentication) {
        try {
            String senderEmail = authentication.getName();
            Message message = messageService.sendMessage(senderEmail, messageRequest);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/conversation/{userEmail}")
    public ResponseEntity<?> getConversation(@PathVariable String userEmail, 
                                           Authentication authentication) {
        try {
            String currentUserEmail = authentication.getName();
            List<Message> messages = messageService.getConversation(currentUserEmail, userEmail);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<?> getAllConversations(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            return ResponseEntity.ok(messageService.getAllConversations(userEmail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String messageId, 
                                      Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            messageService.markAsRead(messageId, userEmail);
            return ResponseEntity.ok().body("{\"success\": true}");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadMessages(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            List<Message> unreadMessages = messageService.getUnreadMessages(userEmail);
            return ResponseEntity.ok(unreadMessages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}