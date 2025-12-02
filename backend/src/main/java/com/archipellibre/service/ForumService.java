package com.archipellibre.service;

import com.archipellibre.dto.ForumPostCreateRequest;
import com.archipellibre.dto.ForumPostUpdateRequest;
import com.archipellibre.dto.ForumThreadCreateRequest;
import com.archipellibre.dto.ForumThreadUpdateRequest;
import com.archipellibre.exception.BusinessLogicException;
import com.archipellibre.exception.ResourceNotFoundException;
import com.archipellibre.model.ForumPost;
import com.archipellibre.model.ForumThread;
import com.archipellibre.model.User;
import com.archipellibre.repository.ForumPostRepository;
import com.archipellibre.repository.ForumThreadRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ForumService {

    private final ForumThreadRepository threadRepository;
    private final ForumPostRepository postRepository;
    private final UserService userService;

    // ===== THREAD MANAGEMENT =====

    /**
     * Create a new forum thread
     */
    public ForumThread createThread(UUID creatorId, ForumThreadCreateRequest request) {
        User creator = userService.getUserById(creatorId);

        ForumThread thread = ForumThread.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .creator(creator)
                .pinned(false)
                .locked(false)
                .lastActivityAt(LocalDateTime.now())
                .build();

        ForumThread savedThread = threadRepository.save(thread);
        log.info("Forum thread created: {} by user: {}", savedThread.getId(), creatorId);
        return savedThread;
    }

    /**
     * Get thread by ID
     */
    public ForumThread getThreadById(UUID threadId) {
        return threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum thread not found with ID: " + threadId));
    }

    /**
     * Get all threads with pagination (ordered by recent activity)
     */
    @Transactional(readOnly = true)
    public Page<ForumThread> getAllThreads(Pageable pageable) {
        return threadRepository.findAllByOrderByLastActivityAtDesc(pageable);
    }

    /**
     * Get threads by category
     */
    @Transactional(readOnly = true)
    public Page<ForumThread> getThreadsByCategory(String category, Pageable pageable) {
        return threadRepository.findByCategory(category, pageable);
    }

    /**
     * Get threads created by user
     */
    @Transactional(readOnly = true)
    public Page<ForumThread> getThreadsByCreator(UUID creatorId, Pageable pageable) {
        userService.getUserById(creatorId); // Verify user exists
        return threadRepository.findByCreatorId(creatorId, pageable);
    }

    /**
     * Get pinned threads (sticky)
     */
    @Transactional(readOnly = true)
    public List<ForumThread> getPinnedThreads() {
        return threadRepository.findByPinnedTrue();
    }

    /**
     * Update thread details (creator or moderator only)
     */
    public ForumThread updateThread(UUID threadId, ForumThreadUpdateRequest request) {
        ForumThread thread = getThreadById(threadId);

        if (request.getTitle() != null) {
            thread.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            thread.setContent(request.getContent());
        }

        if (request.getCategory() != null) {
            thread.setCategory(request.getCategory());
        }

        ForumThread updated = threadRepository.save(thread);
        log.info("Forum thread updated: {}", threadId);
        return updated;
    }

    /**
     * Pin thread (sticky thread - moderator/admin only)
     */
    public ForumThread pinThread(UUID threadId) {
        ForumThread thread = getThreadById(threadId);

        if (thread.getPinned()) {
            throw new BusinessLogicException("Thread is already pinned");
        }

        thread.setPinned(true);
        ForumThread updated = threadRepository.save(thread);
        log.info("Thread pinned: {}", threadId);
        return updated;
    }

    /**
     * Unpin thread
     */
    public ForumThread unpinThread(UUID threadId) {
        ForumThread thread = getThreadById(threadId);

        if (!thread.getPinned()) {
            throw new BusinessLogicException("Thread is not pinned");
        }

        thread.setPinned(false);
        ForumThread updated = threadRepository.save(thread);
        log.info("Thread unpinned: {}", threadId);
        return updated;
    }

    /**
     * Lock thread (no new posts allowed - moderator/admin only)
     */
    public ForumThread lockThread(UUID threadId, String reason) {
        ForumThread thread = getThreadById(threadId);

        if (thread.getLocked()) {
            throw new BusinessLogicException("Thread is already locked");
        }

        thread.setLocked(true);
        ForumThread updated = threadRepository.save(thread);
        log.info("Thread locked: {} - Reason: {}", threadId, reason);
        return updated;
    }

    /**
     * Unlock thread
     */
    public ForumThread unlockThread(UUID threadId) {
        ForumThread thread = getThreadById(threadId);

        if (!thread.getLocked()) {
            throw new BusinessLogicException("Thread is not locked");
        }

        thread.setLocked(false);
        ForumThread updated = threadRepository.save(thread);
        log.info("Thread unlocked: {}", threadId);
        return updated;
    }

    /**
     * Check if thread is locked
     */
    @Transactional(readOnly = true)
    public boolean isThreadLocked(UUID threadId) {
        ForumThread thread = getThreadById(threadId);
        return thread.getLocked();
    }

    /**
     * Delete thread (moderator/admin only)
     */
    public void deleteThread(UUID threadId) {
        ForumThread thread = getThreadById(threadId);
        threadRepository.delete(thread);
        log.info("Forum thread deleted: {}", threadId);
    }

    /**
     * Get thread statistics
     */
    @Transactional(readOnly = true)
    public ThreadStats getThreadStats(UUID threadId) {
        ForumThread thread = getThreadById(threadId);
        long postCount = postRepository.countByThreadId(threadId);

        return ThreadStats.builder()
                .threadId(threadId)
                .title(thread.getTitle())
                .category(thread.getCategory())
                .postCount(postCount)
                .pinned(thread.getPinned())
                .locked(thread.getLocked())
                .createdBy(thread.getCreator().getUsername())
                .createdAt(thread.getCreatedAt())
                .lastActivityAt(thread.getLastActivityAt())
                .build();
    }

    // ===== POST MANAGEMENT =====

    /**
     * Create a post in a thread
     */
    public ForumPost createPost(UUID threadId, UUID authorId, ForumPostCreateRequest request) {
        ForumThread thread = getThreadById(threadId);
        User author = userService.getUserById(authorId);

        if (thread.getLocked()) {
            throw new BusinessLogicException("Cannot post in a locked thread");
        }

        ForumPost post = ForumPost.builder()
                .content(request.getContent())
                .author(author)
                .thread(thread)
                .edited(false)
                .build();

        ForumPost savedPost = postRepository.save(post);
        
        // Update thread's last activity
        thread.setLastActivityAt(LocalDateTime.now());
        threadRepository.save(thread);

        log.info("Forum post created: {} in thread: {} by user: {}", savedPost.getId(), threadId, authorId);
        return savedPost;
    }

    /**
     * Get post by ID
     */
    public ForumPost getPostById(UUID postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Forum post not found with ID: " + postId));
    }

    /**
     * Get posts in thread
     */
    @Transactional(readOnly = true)
    public Page<ForumPost> getPostsByThread(UUID threadId, Pageable pageable) {
        getThreadById(threadId); // Verify thread exists
        return postRepository.findByThreadId(threadId, pageable);
    }

    /**
     * Get posts by author
     */
    @Transactional(readOnly = true)
    public Page<ForumPost> getPostsByAuthor(UUID authorId, Pageable pageable) {
        userService.getUserById(authorId); // Verify user exists
        return postRepository.findByAuthorId(authorId, pageable);
    }

    /**
     * Update post (author or moderator only)
     */
    public ForumPost updatePost(UUID postId, ForumPostUpdateRequest request) {
        ForumPost post = getPostById(postId);

        if (request.getContent() != null) {
            post.setContent(request.getContent());
            post.setEdited(true);
        }

        ForumPost updated = postRepository.save(post);
        log.info("Forum post updated: {}", postId);
        return updated;
    }

    /**
     * Delete post (author or moderator only)
     */
    public void deletePost(UUID postId) {
        ForumPost post = getPostById(postId);
        ForumThread thread = post.getThread();
        
        postRepository.delete(post);
        
        // Update thread's last activity
        thread.setLastActivityAt(LocalDateTime.now());
        threadRepository.save(thread);

        log.info("Forum post deleted: {}", postId);
    }

    /**
     * Get post count in thread
     */
    @Transactional(readOnly = true)
    public long getPostCount(UUID threadId) {
        getThreadById(threadId); // Verify thread exists
        return postRepository.countByThreadId(threadId);
    }

    /**
     * Search threads by keyword (simple - can be enhanced with Elasticsearch later)
     */
    @Transactional(readOnly = true)
    public List<ForumThread> searchThreads(String keyword) {
        return threadRepository.findAll().stream()
                .filter(t -> 
                    t.getTitle().toLowerCase().contains(keyword.toLowerCase()) ||
                    t.getContent().toLowerCase().contains(keyword.toLowerCase())
                )
                .toList();
    }

    // ===== MODERATION ENDPOINTS =====

    /**
     * Flag post for moderation (report inappropriate content)
     */
    public void flagPostForModeration(UUID postId, String reason) {
        getPostById(postId); // Verify post exists
        // In a real application, this would create a moderation ticket
        log.warn("Post flagged for moderation: {} - Reason: {}", postId, reason);
    }

    /**
     * Get post statistics
     */
    @Transactional(readOnly = true)
    public PostStats getPostStats(UUID postId) {
        ForumPost post = getPostById(postId);

        return PostStats.builder()
                .postId(postId)
                .authorUsername(post.getAuthor().getUsername())
                .threadId(post.getThread().getId())
                .threadTitle(post.getThread().getTitle())
                .edited(post.getEdited())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .contentLength(post.getContent().length())
                .build();
    }

    // ===== HELPER CLASSES =====

    @lombok.Data
    @lombok.Builder
    public static class ThreadStats {
        private UUID threadId;
        private String title;
        private String category;
        private long postCount;
        private boolean pinned;
        private boolean locked;
        private String createdBy;
        private LocalDateTime createdAt;
        private LocalDateTime lastActivityAt;
    }

    @lombok.Data
    @lombok.Builder
    public static class PostStats {
        private UUID postId;
        private String authorUsername;
        private UUID threadId;
        private String threadTitle;
        private boolean edited;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private int contentLength;
    }
}
