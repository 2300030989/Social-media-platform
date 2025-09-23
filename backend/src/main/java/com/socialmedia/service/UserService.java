package com.socialmedia.service;

import com.socialmedia.model.User;
import com.socialmedia.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        List<User> users = userRepository.findAllActiveUsers();
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    public Optional<User> getUserById(String id) {
        try {
            Optional<User> userOptional = userRepository.findById(Long.valueOf(id));
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                user.setPassword(null); // Remove password
                return Optional.of(user);
            }
        } catch (NumberFormatException e) {
            System.err.println("Invalid user ID format: " + id);
        }
        return Optional.empty();
    }

    public Optional<User> getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(null); // Remove password
            return Optional.of(user);
        }
        return Optional.empty();
    }

    public List<User> searchUsers(String query) {
        List<User> users = userRepository.searchUsers(query);
        // Remove passwords from response
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    public User updateUser(String userEmail, User updatedUser) throws Exception {
        Optional<User> userOptional = userRepository.findByEmail(userEmail);
        if (userOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User user = userOptional.get();
        
        // Update allowed fields
        if (updatedUser.getDisplayName() != null && !updatedUser.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(updatedUser.getDisplayName());
        }
        if (updatedUser.getBio() != null) {
            user.setBio(updatedUser.getBio());
        }
        if (updatedUser.getLocation() != null) {
            user.setLocation(updatedUser.getLocation());
        }
        if (updatedUser.getWebsite() != null) {
            user.setWebsite(updatedUser.getWebsite());
        }
        if (updatedUser.getAvatar() != null && !updatedUser.getAvatar().trim().isEmpty()) {
            user.setAvatar(updatedUser.getAvatar());
        }
        if (updatedUser.getProfession() != null) {
            user.setProfession(updatedUser.getProfession());
        }
        if (updatedUser.getBirthDate() != null) {
            user.setBirthDate(updatedUser.getBirthDate());
        }

        user.setLastModified(LocalDateTime.now());
        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // Remove password from response
        return savedUser;
    }

    public User followUser(String followerEmail, String followeeEmail) throws Exception {
        Optional<User> followerOptional = userRepository.findByEmail(followerEmail);
        Optional<User> followeeOptional = userRepository.findByEmail(followeeEmail);

        if (followerOptional.isEmpty() || followeeOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User follower = followerOptional.get();
        User followee = followeeOptional.get();

        if (!follower.getFollowing().contains(followee.getId())) {
            follower.getFollowing().add(followee.getId());
            followee.setFollowers(followee.getFollowers() + 1);
            
            userRepository.save(follower);
            userRepository.save(followee);
        }

        followee.setPassword(null);
        return followee;
    }

    public User unfollowUser(String followerEmail, String followeeEmail) throws Exception {
        Optional<User> followerOptional = userRepository.findByEmail(followerEmail);
        Optional<User> followeeOptional = userRepository.findByEmail(followeeEmail);

        if (followerOptional.isEmpty() || followeeOptional.isEmpty()) {
            throw new Exception("User not found");
        }

        User follower = followerOptional.get();
        User followee = followeeOptional.get();

        if (follower.getFollowing().contains(followee.getId())) {
            follower.getFollowing().remove(followee.getId());
            followee.setFollowers(Math.max(0, followee.getFollowers() - 1));
            
            userRepository.save(follower);
            userRepository.save(followee);
        }

        followee.setPassword(null);
        return followee;
    }
}