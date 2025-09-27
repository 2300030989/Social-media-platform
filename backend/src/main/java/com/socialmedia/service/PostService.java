package com.socialmedia.service;

import com.socialmedia.model.Post;
import com.socialmedia.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    public boolean deletePostIfAuthor(Long id, String authorEmail) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) {
            return false;
        }
        Post post = postOpt.get();
        if (!authorEmail.equals(post.getAuthorEmail())) {
            return false;
        }
        postRepository.deleteById(id);
        return true;
    }

    public List<Post> getPostsByAuthor(String authorEmail) {
        return postRepository.findByAuthorEmail(authorEmail);
    }

    public Post likePost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    public Post unlikePost(Long postId) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
        if (post.getLikes() > 0) {
            post.setLikes(post.getLikes() - 1);
        }
        return postRepository.save(post);
    }
}


