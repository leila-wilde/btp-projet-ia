package com.archipellibre.controller;

import com.archipellibre.dto.ApiResponse;
import com.archipellibre.dto.ForumPostCreateRequest;
import com.archipellibre.dto.ForumPostResponse;
import com.archipellibre.dto.ForumPostUpdateRequest;
import com.archipellibre.dto.ForumThreadCreateRequest;
import com.archipellibre.dto.ForumThreadResponse;
import com.archipellibre.dto.ForumThreadUpdateRequest;
import com.archipellibre.dto.UserResponse;
import com.archipellibre.model.ForumPost;
import com.archipellibre.model.ForumThread;
import com.archipellibre.model.User;
import com.archipellibre.repository.UserRepository;
import com.archipellibre.service.ForumService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final UserRepository userRepository;

    // ===== THREAD ENDPOINTS =====

    @PostMapping("/threads")
    public ResponseEntity<ForumThreadResponse> createThread(
            @Valid @RequestBody ForumThreadCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        
        String username = authentication.getName();
        User creator = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
        
        ForumThread thread = forumService.createThread(creator.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapThreadToResponse(thread));
    }

    @GetMapping("/threads/{id}")
    public ResponseEntity<ForumThreadResponse> getThreadById(@PathVariable UUID id) {
        ForumThread thread = forumService.getThreadById(id);
        return ResponseEntity.ok(mapThreadToResponse(thread));
    }

    @GetMapping("/threads")
    public ResponseEntity<Page<ForumThreadResponse>> getAllThreads(Pageable pageable) {
        Page<ForumThread> threads = forumService.getAllThreads(pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/category/{category}")
    public ResponseEntity<Page<ForumThreadResponse>> getThreadsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        Page<ForumThread> threads = forumService.getThreadsByCategory(category, pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/creator/{creatorId}")
    public ResponseEntity<Page<ForumThreadResponse>> getThreadsByCreator(
            @PathVariable UUID creatorId,
            Pageable pageable) {
        Page<ForumThread> threads = forumService.getThreadsByCreator(creatorId, pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/pinned")
    public ResponseEntity<List<ForumThreadResponse>> getPinnedThreads() {
        List<ForumThread> threads = forumService.getPinnedThreads();
        return ResponseEntity.ok(threads.stream().map(this::mapThreadToResponse).toList());
    }

    @PutMapping("/threads/{id}")
    public ResponseEntity<ForumThreadResponse> updateThread(
            @PathVariable UUID id,
            @Valid @RequestBody ForumThreadUpdateRequest request) {
        ForumThread updated = forumService.updateThread(id, request);
        return ResponseEntity.ok(mapThreadToResponse(updated));
    }

    @GetMapping("/threads/{id}/stats")
    public ResponseEntity<ApiResponse> getThreadStats(@PathVariable UUID id) {
        var stats = forumService.getThreadStats(id);
        String message = String.format(
            "Title: %s, Posts: %d, Pinned: %s, Locked: %s",
            stats.getTitle(),
            stats.getPostCount(),
            stats.isPinned() ? "Yes" : "No",
            stats.isLocked() ? "Yes" : "No"
        );
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    // ===== MODERATION ENDPOINTS =====

    @PostMapping("/threads/{id}/pin")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ForumThreadResponse> pinThread(@PathVariable UUID id) {
        ForumThread pinned = forumService.pinThread(id);
        return ResponseEntity.ok(mapThreadToResponse(pinned));
    }

    @PostMapping("/threads/{id}/unpin")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ForumThreadResponse> unpinThread(@PathVariable UUID id) {
        ForumThread unpinned = forumService.unpinThread(id);
        return ResponseEntity.ok(mapThreadToResponse(unpinned));
    }

    @PostMapping("/threads/{id}/lock")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ForumThreadResponse> lockThread(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        ForumThread locked = forumService.lockThread(id, reason != null ? reason : "Locked by moderator");
        return ResponseEntity.ok(mapThreadToResponse(locked));
    }

    @PostMapping("/threads/{id}/unlock")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ForumThreadResponse> unlockThread(@PathVariable UUID id) {
        ForumThread unlocked = forumService.unlockThread(id);
        return ResponseEntity.ok(mapThreadToResponse(unlocked));
    }

    @GetMapping("/threads/{id}/locked")
    public ResponseEntity<ApiResponse> isThreadLocked(@PathVariable UUID id) {
        boolean locked = forumService.isThreadLocked(id);
        return ResponseEntity.ok(new ApiResponse(true, locked ? "Thread is locked" : "Thread is unlocked"));
    }

    @DeleteMapping("/threads/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteThread(@PathVariable UUID id) {
        forumService.deleteThread(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "Thread deleted successfully"));
    }

    // ===== POST ENDPOINTS =====

    @PostMapping("/threads/{threadId}/posts")
    public ResponseEntity<ForumPostResponse> createPost(
            @PathVariable UUID threadId,
            @Valid @RequestBody ForumPostCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        
        String username = authentication.getName();
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
        
        ForumPost post = forumService.createPost(threadId, author.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapPostToResponse(post));
    }

    @GetMapping("/posts/{id}")
    public ResponseEntity<ForumPostResponse> getPostById(@PathVariable UUID id) {
        ForumPost post = forumService.getPostById(id);
        return ResponseEntity.ok(mapPostToResponse(post));
    }

    @GetMapping("/threads/{threadId}/posts")
    public ResponseEntity<Page<ForumPostResponse>> getPostsByThread(
            @PathVariable UUID threadId,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.getPostsByThread(threadId, pageable);
        return ResponseEntity.ok(posts.map(this::mapPostToResponse));
    }

    @GetMapping("/posts/author/{authorId}")
    public ResponseEntity<Page<ForumPostResponse>> getPostsByAuthor(
            @PathVariable UUID authorId,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.getPostsByAuthor(authorId, pageable);
        return ResponseEntity.ok(posts.map(this::mapPostToResponse));
    }

    @PutMapping("/posts/{id}")
    public ResponseEntity<ForumPostResponse> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody ForumPostUpdateRequest request) {
        ForumPost updated = forumService.updatePost(id, request);
        return ResponseEntity.ok(mapPostToResponse(updated));
    }

    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deletePost(@PathVariable UUID id) {
        forumService.deletePost(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "Post deleted successfully"));
    }

    @GetMapping("/threads/{threadId}/posts/count")
    public ResponseEntity<ApiResponse> getPostCount(@PathVariable UUID threadId) {
        long count = forumService.getPostCount(threadId);
        return ResponseEntity.ok(new ApiResponse(true, "Posts: " + count));
    }

    @GetMapping("/posts/{id}/stats")
    public ResponseEntity<ApiResponse> getPostStats(@PathVariable UUID id) {
        var stats = forumService.getPostStats(id);
        String message = String.format(
            "Author: %s, Edited: %s, Created: %s",
            stats.getAuthorUsername(),
            stats.isEdited() ? "Yes" : "No",
            stats.getCreatedAt()
        );
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    @PostMapping("/posts/{id}/flag")
    public ResponseEntity<ApiResponse> flagPost(
            @PathVariable UUID id,
            @RequestParam String reason) {
        forumService.flagPostForModeration(id, reason);
        return ResponseEntity.ok(new ApiResponse(true, "Post flagged for review"));
    }

    // ===== HELPER METHODS =====

    private ForumThreadResponse mapThreadToResponse(ForumThread thread) {
        return ForumThreadResponse.builder()
                .id(thread.getId())
                .title(thread.getTitle())
                .content(thread.getContent())
                .category(thread.getCategory())
                .pinned(thread.getPinned())
                .locked(thread.getLocked())
                .creator(mapUserToResponse(thread.getCreator()))
                .posts(thread.getPosts().stream()
                        .map(this::mapPostToResponse)
                        .toList())
                .postCount(thread.getPosts().size())
                .createdAt(thread.getCreatedAt())
                .updatedAt(thread.getUpdatedAt())
                .lastActivityAt(thread.getLastActivityAt())
                .build();
    }

    private ForumPostResponse mapPostToResponse(ForumPost post) {
        return ForumPostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .author(mapUserToResponse(post.getAuthor()))
                .threadId(post.getThread().getId())
                .edited(post.getEdited())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private UserResponse mapUserToResponse(com.archipellibre.model.User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
