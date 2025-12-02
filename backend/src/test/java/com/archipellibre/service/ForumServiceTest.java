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
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.ForumPostRepository;
import com.archipellibre.repository.ForumThreadRepository;
import com.archipellibre.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("ForumService Integration Tests")
class ForumServiceTest {

    @Autowired
    private ForumService forumService;

    @Autowired
    private ForumThreadRepository threadRepository;

    @Autowired
    private ForumPostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User creator;
    private User author1;
    private User author2;

    @BeforeEach
    void setUp() {
        threadRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();

        creator = User.builder()
                .username("thread_creator")
                .email("creator@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        author1 = User.builder()
                .username("author1")
                .email("author1@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        author2 = User.builder()
                .username("author2")
                .email("author2@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        userRepository.save(creator);
        userRepository.save(author1);
        userRepository.save(author2);
    }

    // ===== THREAD CREATION TESTS =====

    @Test
    @DisplayName("Should create forum thread successfully")
    void testCreateThread() {
        ForumThreadCreateRequest request = ForumThreadCreateRequest.builder()
                .title("Discussion on Java")
                .content("Let's discuss Java best practices")
                .category("Technology")
                .build();

        ForumThread created = forumService.createThread(creator.getId(), request);

        assertNotNull(created.getId());
        assertEquals("Discussion on Java", created.getTitle());
        assertEquals(creator.getId(), created.getCreator().getId());
        assertFalse(created.getPinned());
        assertFalse(created.getLocked());
    }

    @Test
    @DisplayName("Should get thread by ID")
    void testGetThreadById() {
        ForumThread thread = createTestThread();

        ForumThread found = forumService.getThreadById(thread.getId());

        assertNotNull(found);
        assertEquals(thread.getId(), found.getId());
    }

    @Test
    @DisplayName("Should throw exception when thread not found")
    void testGetThreadByIdNotFound() {
        assertThrows(ResourceNotFoundException.class,
            () -> forumService.getThreadById(UUID.randomUUID()));
    }

    @Test
    @DisplayName("Should get all threads")
    void testGetAllThreads() {
        createTestThread();
        createTestThread();

        Pageable pageable = PageRequest.of(0, 10);
        var threads = forumService.getAllThreads(pageable);

        assertEquals(2, threads.getTotalElements());
    }

    @Test
    @DisplayName("Should get threads by category")
    void testGetThreadsByCategory() {
        ForumThreadCreateRequest req1 = ForumThreadCreateRequest.builder()
                .title("Tech Discussion")
                .content("Content")
                .category("Technology")
                .build();
        ForumThreadCreateRequest req2 = ForumThreadCreateRequest.builder()
                .title("Gaming Chat")
                .content("Content")
                .category("Gaming")
                .build();

        forumService.createThread(creator.getId(), req1);
        forumService.createThread(creator.getId(), req2);

        Pageable pageable = PageRequest.of(0, 10);
        var tech = forumService.getThreadsByCategory("Technology", pageable);
        var gaming = forumService.getThreadsByCategory("Gaming", pageable);

        assertEquals(1, tech.getTotalElements());
        assertEquals(1, gaming.getTotalElements());
    }

    @Test
    @DisplayName("Should get pinned threads")
    void testGetPinnedThreads() {
        ForumThread thread1 = createTestThread();
        ForumThread thread2 = createTestThread();
        
        forumService.pinThread(thread1.getId());

        var pinned = forumService.getPinnedThreads();

        assertEquals(1, pinned.size());
        assertTrue(pinned.get(0).getPinned());
    }

    // ===== THREAD MODERATION TESTS =====

    @Test
    @DisplayName("Should pin thread")
    void testPinThread() {
        ForumThread thread = createTestThread();

        ForumThread pinned = forumService.pinThread(thread.getId());

        assertTrue(pinned.getPinned());
    }

    @Test
    @DisplayName("Should throw exception when pinning already pinned thread")
    void testPinAlreadyPinnedThread() {
        ForumThread thread = createTestThread();
        forumService.pinThread(thread.getId());

        assertThrows(BusinessLogicException.class,
            () -> forumService.pinThread(thread.getId()));
    }

    @Test
    @DisplayName("Should unpin thread")
    void testUnpinThread() {
        ForumThread thread = createTestThread();
        forumService.pinThread(thread.getId());

        ForumThread unpinned = forumService.unpinThread(thread.getId());

        assertFalse(unpinned.getPinned());
    }

    @Test
    @DisplayName("Should lock thread")
    void testLockThread() {
        ForumThread thread = createTestThread();

        ForumThread locked = forumService.lockThread(thread.getId(), "Inappropriate discussion");

        assertTrue(locked.getLocked());
    }

    @Test
    @DisplayName("Should throw exception when locking already locked thread")
    void testLockAlreadyLockedThread() {
        ForumThread thread = createTestThread();
        forumService.lockThread(thread.getId(), "Reason");

        assertThrows(BusinessLogicException.class,
            () -> forumService.lockThread(thread.getId(), "Reason"));
    }

    @Test
    @DisplayName("Should unlock thread")
    void testUnlockThread() {
        ForumThread thread = createTestThread();
        forumService.lockThread(thread.getId(), "Reason");

        ForumThread unlocked = forumService.unlockThread(thread.getId());

        assertFalse(unlocked.getLocked());
    }

    @Test
    @DisplayName("Should check if thread is locked")
    void testIsThreadLocked() {
        ForumThread thread = createTestThread();

        assertFalse(forumService.isThreadLocked(thread.getId()));

        forumService.lockThread(thread.getId(), "Reason");

        assertTrue(forumService.isThreadLocked(thread.getId()));
    }

    @Test
    @DisplayName("Should delete thread")
    void testDeleteThread() {
        ForumThread thread = createTestThread();

        forumService.deleteThread(thread.getId());

        assertThrows(ResourceNotFoundException.class,
            () -> forumService.getThreadById(thread.getId()));
    }

    @Test
    @DisplayName("Should update thread")
    void testUpdateThread() {
        ForumThread thread = createTestThread();
        ForumThreadUpdateRequest request = ForumThreadUpdateRequest.builder()
                .title("Updated Title")
                .category("Updated Category")
                .build();

        ForumThread updated = forumService.updateThread(thread.getId(), request);

        assertEquals("Updated Title", updated.getTitle());
        assertEquals("Updated Category", updated.getCategory());
    }

    // ===== POST CREATION TESTS =====

    @Test
    @DisplayName("Should create post in thread")
    void testCreatePost() {
        ForumThread thread = createTestThread();
        ForumPostCreateRequest request = ForumPostCreateRequest.builder()
                .content("Great discussion point!")
                .build();

        ForumPost created = forumService.createPost(thread.getId(), author1.getId(), request);

        assertNotNull(created.getId());
        assertEquals("Great discussion point!", created.getContent());
        assertEquals(author1.getId(), created.getAuthor().getId());
        assertFalse(created.getEdited());
    }

    @Test
    @DisplayName("Should throw exception when posting in locked thread")
    void testCreatePostInLockedThread() {
        ForumThread thread = createTestThread();
        forumService.lockThread(thread.getId(), "Locked");

        ForumPostCreateRequest request = ForumPostCreateRequest.builder()
                .content("This should fail")
                .build();

        assertThrows(BusinessLogicException.class,
            () -> forumService.createPost(thread.getId(), author1.getId(), request));
    }

    @Test
    @DisplayName("Should get post by ID")
    void testGetPostById() {
        ForumPost post = createTestPost();

        ForumPost found = forumService.getPostById(post.getId());

        assertNotNull(found);
        assertEquals(post.getId(), found.getId());
    }

    @Test
    @DisplayName("Should get posts in thread")
    void testGetPostsByThread() {
        ForumThread thread = createTestThread();
        createTestPost(thread, author1);
        createTestPost(thread, author2);

        Pageable pageable = PageRequest.of(0, 10);
        var posts = forumService.getPostsByThread(thread.getId(), pageable);

        assertEquals(2, posts.getTotalElements());
    }

    @Test
    @DisplayName("Should get posts by author")
    void testGetPostsByAuthor() {
        ForumThread thread = createTestThread();
        createTestPost(thread, author1);
        createTestPost(thread, author1);
        createTestPost(thread, author2);

        Pageable pageable = PageRequest.of(0, 10);
        var posts = forumService.getPostsByAuthor(author1.getId(), pageable);

        assertEquals(2, posts.getTotalElements());
    }

    @Test
    @DisplayName("Should update post")
    void testUpdatePost() {
        ForumPost post = createTestPost();
        ForumPostUpdateRequest request = ForumPostUpdateRequest.builder()
                .content("Updated content")
                .build();

        ForumPost updated = forumService.updatePost(post.getId(), request);

        assertEquals("Updated content", updated.getContent());
        assertTrue(updated.getEdited());
    }

    @Test
    @DisplayName("Should delete post")
    void testDeletePost() {
        ForumPost post = createTestPost();

        forumService.deletePost(post.getId());

        assertThrows(ResourceNotFoundException.class,
            () -> forumService.getPostById(post.getId()));
    }

    @Test
    @DisplayName("Should get post count in thread")
    void testGetPostCount() {
        ForumThread thread = createTestThread();
        createTestPost(thread, author1);
        createTestPost(thread, author2);

        long count = forumService.getPostCount(thread.getId());

        assertEquals(2, count);
    }

    // ===== STATISTICS TESTS =====

    @Test
    @DisplayName("Should get thread statistics")
    void testGetThreadStats() {
        ForumThread thread = createTestThread();
        createTestPost(thread, author1);
        createTestPost(thread, author2);

        var stats = forumService.getThreadStats(thread.getId());

        assertEquals(thread.getId(), stats.getThreadId());
        assertEquals(2, stats.getPostCount());
        assertEquals("Test Thread", stats.getTitle());
    }

    @Test
    @DisplayName("Should get post statistics")
    void testGetPostStats() {
        ForumPost post = createTestPost();

        var stats = forumService.getPostStats(post.getId());

        assertEquals(post.getId(), stats.getPostId());
        assertEquals(author1.getUsername(), stats.getAuthorUsername());
        assertFalse(stats.isEdited());
    }

    // ===== HELPER METHODS =====

    private ForumThread createTestThread() {
        ForumThreadCreateRequest request = ForumThreadCreateRequest.builder()
                .title("Test Thread")
                .content("Test content")
                .category("General")
                .build();
        return forumService.createThread(creator.getId(), request);
    }

    private ForumPost createTestPost() {
        return createTestPost(createTestThread(), author1);
    }

    private ForumPost createTestPost(ForumThread thread, User author) {
        ForumPostCreateRequest request = ForumPostCreateRequest.builder()
                .content("Test post content")
                .build();
        return forumService.createPost(thread.getId(), author.getId(), request);
    }
}
