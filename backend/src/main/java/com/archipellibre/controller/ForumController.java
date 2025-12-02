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
import com.archipellibre.service.ForumService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
@Tag(name = "Forum Management", description = "Forum threads, posts, and moderation")
@SecurityRequirement(name = "Bearer Authentication")
public class ForumController {

    private final ForumService forumService;

    // ===== THREAD ENDPOINTS =====

    @PostMapping("/threads")
    @Operation(summary = "Create forum thread")
    public ResponseEntity<ForumThreadResponse> createThread(
            @RequestParam UUID creatorId,
            @Valid @RequestBody ForumThreadCreateRequest request) {
        ForumThread thread = forumService.createThread(creatorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapThreadToResponse(thread));
    }

    @GetMapping("/threads/{id}")
    @Operation(summary = "Get thread by ID")
    public ResponseEntity<ForumThreadResponse> getThreadById(@PathVariable UUID id) {
        ForumThread thread = forumService.getThreadById(id);
        return ResponseEntity.ok(mapThreadToResponse(thread));
    }

    @GetMapping("/threads")
    @Operation(summary = "Get all threads", description = "Retrieve all threads ordered by recent activity")
    public ResponseEntity<Page<ForumThreadResponse>> getAllThreads(Pageable pageable) {
        Page<ForumThread> threads = forumService.getAllThreads(pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/category/{category}")
    @Operation(summary = "Get threads by category")
    public ResponseEntity<Page<ForumThreadResponse>> getThreadsByCategory(
            @PathVariable String category,
            Pageable pageable) {
        Page<ForumThread> threads = forumService.getThreadsByCategory(category, pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/creator/{creatorId}")
    @Operation(summary = "Get threads by creator")
    public ResponseEntity<Page<ForumThreadResponse>> getThreadsByCreator(
            @PathVariable UUID creatorId,
            Pageable pageable) {
        Page<ForumThread> threads = forumService.getThreadsByCreator(creatorId, pageable);
        return ResponseEntity.ok(threads.map(this::mapThreadToResponse));
    }

    @GetMapping("/threads/pinned")
    @Operation(summary = "Get pinned threads (sticky)")
    public ResponseEntity<List<ForumThreadResponse>> getPinnedThreads() {
        List<ForumThread> threads = forumService.getPinnedThreads();
        return ResponseEntity.ok(threads.stream().map(this::mapThreadToResponse).toList());
    }

    @PutMapping("/threads/{id}")
    @Operation(summary = "Update thread", description = "Update thread title, content, or category")
    public ResponseEntity<ForumThreadResponse> updateThread(
            @PathVariable UUID id,
            @Valid @RequestBody ForumThreadUpdateRequest request) {
        ForumThread updated = forumService.updateThread(id, request);
        return ResponseEntity.ok(mapThreadToResponse(updated));
    }

    @GetMapping("/threads/{id}/stats")
    @Operation(summary = "Get thread statistics")
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
    @Operation(summary = "Pin thread (sticky)")
    public ResponseEntity<ForumThreadResponse> pinThread(@PathVariable UUID id) {
        ForumThread pinned = forumService.pinThread(id);
        return ResponseEntity.ok(mapThreadToResponse(pinned));
    }

    @PostMapping("/threads/{id}/unpin")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(summary = "Unpin thread")
    public ResponseEntity<ForumThreadResponse> unpinThread(@PathVariable UUID id) {
        ForumThread unpinned = forumService.unpinThread(id);
        return ResponseEntity.ok(mapThreadToResponse(unpinned));
    }

    @PostMapping("/threads/{id}/lock")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(summary = "Lock thread (no new posts)")
    public ResponseEntity<ForumThreadResponse> lockThread(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        ForumThread locked = forumService.lockThread(id, reason != null ? reason : "Locked by moderator");
        return ResponseEntity.ok(mapThreadToResponse(locked));
    }

    @PostMapping("/threads/{id}/unlock")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(summary = "Unlock thread")
    public ResponseEntity<ForumThreadResponse> unlockThread(@PathVariable UUID id) {
        ForumThread unlocked = forumService.unlockThread(id);
        return ResponseEntity.ok(mapThreadToResponse(unlocked));
    }

    @GetMapping("/threads/{id}/locked")
    @Operation(summary = "Check if thread is locked")
    public ResponseEntity<ApiResponse> isThreadLocked(@PathVariable UUID id) {
        boolean locked = forumService.isThreadLocked(id);
        return ResponseEntity.ok(new ApiResponse(true, locked ? "Thread is locked" : "Thread is unlocked"));
    }

    @DeleteMapping("/threads/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(summary = "Delete thread (moderator/admin only)")
    public ResponseEntity<ApiResponse> deleteThread(@PathVariable UUID id) {
        forumService.deleteThread(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "Thread deleted successfully"));
    }

    // ===== POST ENDPOINTS =====

    @PostMapping("/threads/{threadId}/posts")
    @Operation(summary = "Create post in thread")
    public ResponseEntity<ForumPostResponse> createPost(
            @PathVariable UUID threadId,
            @RequestParam UUID authorId,
            @Valid @RequestBody ForumPostCreateRequest request) {
        ForumPost post = forumService.createPost(threadId, authorId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapPostToResponse(post));
    }

    @GetMapping("/posts/{id}")
    @Operation(summary = "Get post by ID")
    public ResponseEntity<ForumPostResponse> getPostById(@PathVariable UUID id) {
        ForumPost post = forumService.getPostById(id);
        return ResponseEntity.ok(mapPostToResponse(post));
    }

    @GetMapping("/threads/{threadId}/posts")
    @Operation(summary = "Get posts in thread")
    public ResponseEntity<Page<ForumPostResponse>> getPostsByThread(
            @PathVariable UUID threadId,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.getPostsByThread(threadId, pageable);
        return ResponseEntity.ok(posts.map(this::mapPostToResponse));
    }

    @GetMapping("/posts/author/{authorId}")
    @Operation(summary = "Get posts by author")
    public ResponseEntity<Page<ForumPostResponse>> getPostsByAuthor(
            @PathVariable UUID authorId,
            Pageable pageable) {
        Page<ForumPost> posts = forumService.getPostsByAuthor(authorId, pageable);
        return ResponseEntity.ok(posts.map(this::mapPostToResponse));
    }

    @PutMapping("/posts/{id}")
    @Operation(summary = "Update post")
    public ResponseEntity<ForumPostResponse> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody ForumPostUpdateRequest request) {
        ForumPost updated = forumService.updatePost(id, request);
        return ResponseEntity.ok(mapPostToResponse(updated));
    }

    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    @Operation(summary = "Delete post (moderator/admin only)")
    public ResponseEntity<ApiResponse> deletePost(@PathVariable UUID id) {
        forumService.deletePost(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "Post deleted successfully"));
    }

    @GetMapping("/threads/{threadId}/posts/count")
    @Operation(summary = "Get post count in thread")
    public ResponseEntity<ApiResponse> getPostCount(@PathVariable UUID threadId) {
        long count = forumService.getPostCount(threadId);
        return ResponseEntity.ok(new ApiResponse(true, "Posts: " + count));
    }

    @GetMapping("/posts/{id}/stats")
    @Operation(summary = "Get post statistics")
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
    @Operation(summary = "Flag post for moderation")
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
