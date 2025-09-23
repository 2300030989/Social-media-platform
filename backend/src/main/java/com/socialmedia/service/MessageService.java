package com.socialmedia.service;

import com.socialmedia.dto.MessageRequest;
import com.socialmedia.model.Message;
import com.socialmedia.model.User;
import com.socialmedia.repository.MessageRepository;
import com.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public Message sendMessage(String senderEmail, MessageRequest messageRequest) throws Exception {
        // Validate sender exists
        Optional<User> senderOptional = userRepository.findByEmail(senderEmail);
        if (senderOptional.isEmpty()) {
            throw new Exception("Sender not found");
        }

        // Validate recipient exists
        Optional<User> recipientOptional = userRepository.findByEmail(messageRequest.getRecipientEmail());
        if (recipientOptional.isEmpty()) {
            throw new Exception("Recipient not found");
        }

        Message message = new Message(senderEmail, messageRequest.getRecipientEmail(), messageRequest.getContent());
        
        // Handle media if present
        if (messageRequest.getMediaData() != null && !messageRequest.getMediaData().isEmpty()) {
            message.setMediaData(messageRequest.getMediaData());
            message.setMediaType(messageRequest.getMediaType());
            message.setMediaFilename(messageRequest.getMediaFilename());
        }
        
        return messageRepository.save(message);
    }

    public List<Message> getConversation(String userEmail1, String userEmail2) {
        List<Message> messages = messageRepository.findConversationBetweenUsers(userEmail1, userEmail2);
        return messages.stream()
                .sorted(Comparator.comparing(Message::getTimestamp))
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAllConversations(String userEmail) {
        List<Message> allMessages = messageRepository.findAllUserMessages(userEmail);
        
        // Group messages by conversation partner
        Map<String, List<Message>> conversationMap = new HashMap<>();
        
        for (Message message : allMessages) {
            String partnerEmail = message.getSenderEmail().equals(userEmail) ? 
                                 message.getRecipientEmail() : message.getSenderEmail();
            
            conversationMap.computeIfAbsent(partnerEmail, k -> new ArrayList<>()).add(message);
        }

        // Create conversation summaries
        List<Map<String, Object>> conversations = new ArrayList<>();
        
        for (Map.Entry<String, List<Message>> entry : conversationMap.entrySet()) {
            String partnerEmail = entry.getKey();
            List<Message> messages = entry.getValue();
            
            // Sort messages by timestamp
            messages.sort(Comparator.comparing(Message::getTimestamp).reversed());
            
            Optional<User> partnerOptional = userRepository.findByEmail(partnerEmail);
            if (partnerOptional.isPresent()) {
                User partner = partnerOptional.get();
                partner.setPassword(null); // Remove password
                
                Map<String, Object> conversation = new HashMap<>();
                conversation.put("partner", partner);
                conversation.put("lastMessage", messages.get(0));
                conversation.put("unreadCount", messages.stream()
                    .mapToInt(m -> (!m.isRead() && m.getRecipientEmail().equals(userEmail)) ? 1 : 0)
                    .sum());
                
                conversations.add(conversation);
            }
        }

        // Sort conversations by last message timestamp
        conversations.sort((a, b) -> {
            Message lastA = (Message) a.get("lastMessage");
            Message lastB = (Message) b.get("lastMessage");
            return lastB.getTimestamp().compareTo(lastA.getTimestamp());
        });

        Map<String, Object> result = new HashMap<>();
        result.put("conversations", conversations);
        return result;
    }

    public void markAsRead(String messageId, String userEmail) throws Exception {
        Optional<Message> messageOptional = messageRepository.findById(Long.valueOf(messageId));
        if (messageOptional.isEmpty()) {
            throw new Exception("Message not found");
        }

        Message message = messageOptional.get();
        if (!message.getRecipientEmail().equals(userEmail)) {
            throw new Exception("Unauthorized to mark this message as read");
        }

        message.setRead(true);
        messageRepository.save(message);
    }

    public List<Message> getUnreadMessages(String userEmail) {
        return messageRepository.findUnreadMessages(userEmail);
    }
}