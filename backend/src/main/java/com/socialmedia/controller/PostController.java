package com.socialmedia.controller;

import com.socialmedia.model.Post;
import com.socialmedia.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
                  .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post post) {
        post.setId(id);
        return ResponseEntity.ok(postService.updatePost(post));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUserEmail = authentication != null ? authentication.getName() : null;

        if (currentUserEmail == null || currentUserEmail.isEmpty()) {
            return ResponseEntity.status(401).build();
        }

        boolean deleted = postService.deletePostIfAuthor(id, currentUserEmail);
        if (!deleted) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{authorEmail}")
    public ResponseEntity<List<Post>> getPostsByAuthor(@PathVariable String authorEmail) {
        return ResponseEntity.ok(postService.getPostsByAuthor(authorEmail));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Post> unlikePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.unlikePost(id));
    }
}


