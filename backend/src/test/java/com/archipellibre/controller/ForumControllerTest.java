package com.archipellibre.controller;

import com.archipellibre.dto.ForumPostCreateRequest;
import com.archipellibre.dto.ForumPostUpdateRequest;
import com.archipellibre.dto.ForumThreadCreateRequest;
import com.archipellibre.dto.ForumThreadUpdateRequest;
import com.archipellibre.model.ForumPost;
import com.archipellibre.model.ForumThread;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.ForumPostRepository;
import com.archipellibre.repository.ForumThreadRepository;
import com.archipellibre.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class ForumControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ForumThreadRepository forumThreadRepository;

    @Autowired
    private ForumPostRepository forumPostRepository;

    private User threadCreator;
    private User postAuthor;
    private User moderator;
    private ForumThread testThread;
    private ForumPost testPost;

    @BeforeEach
    void setUp() {
        forumPostRepository.deleteAll();
        forumThreadRepository.deleteAll();
        userRepository.deleteAll();

        threadCreator = User.builder()
                .username("creator")
                .email("creator@example.com")
                .passwordHash("hashed")
                .role(UserRole.USER)
                .active(true)
                .build();
        threadCreator = userRepository.save(threadCreator);

        postAuthor = User.builder()
                .username("author")
                .email("author@example.com")
                .passwordHash("hashed")
                .role(UserRole.USER)
                .active(true)
                .build();
        postAuthor = userRepository.save(postAuthor);

        moderator = User.builder()
                .username("moderator")
                .email("moderator@example.com")
                .passwordHash("hashed")
                .role(UserRole.MODERATOR)
                .active(true)
                .build();
        moderator = userRepository.save(moderator);

        testThread = ForumThread.builder()
                .title("Welcome to Forum")
                .content("This is the first thread")
                .category("General")
                .creator(threadCreator)
                .pinned(false)
                .locked(false)
                .posts(new ArrayList<>())
                .build();
        testThread = forumThreadRepository.save(testThread);

        testPost = ForumPost.builder()
                .content("This is a test post")
                .author(postAuthor)
                .thread(testThread)
                .build();
        testPost = forumPostRepository.save(testPost);
    }

    // ===== THREAD: PUBLIC GET ENDPOINTS =====

    @Test
    void shouldGetThreadById() throws Exception {
        mockMvc.perform(get("/api/forum/threads/" + testThread.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testThread.getId().toString()))
                .andExpect(jsonPath("$.title").value("Welcome to Forum"))
                .andExpect(jsonPath("$.category").value("General"));
    }

    @Test
    void shouldGetThreadByIdNotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(get("/api/forum/threads/" + nonExistentId))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetAllThreads() throws Exception {
        ForumThread thread2 = ForumThread.builder()
                .title("Another Thread")
                .content("More discussion")
                .category("General")
                .creator(threadCreator)
                .pinned(false)
                .locked(false)
                .posts(new ArrayList<>())
                .build();
        forumThreadRepository.save(thread2);

        mockMvc.perform(get("/api/forum/threads?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2))
                .andExpect(jsonPath("$.totalElements").value(2));
    }

    @Test
    void shouldGetThreadsByCategory() throws Exception {
        mockMvc.perform(get("/api/forum/threads/category/General?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].category").value("General"));
    }

    @Test
    void shouldGetThreadsByCreator() throws Exception {
        mockMvc.perform(get("/api/forum/threads/creator/" + threadCreator.getId() + "?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].creator.username").value("creator"));
    }

    @Test
    void shouldGetPinnedThreads() throws Exception {
        testThread.setPinned(true);
        forumThreadRepository.save(testThread);

        mockMvc.perform(get("/api/forum/threads/pinned"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].pinned").value(true));
    }

    @Test
    void shouldGetThreadStats() throws Exception {
        mockMvc.perform(get("/api/forum/threads/" + testThread.getId() + "/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void shouldCheckThreadLocked() throws Exception {
        mockMvc.perform(get("/api/forum/threads/" + testThread.getId() + "/locked"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Thread is unlocked"));
    }

    // ===== THREAD: CREATE (requires auth) =====

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldCreateThread() throws Exception {
        ForumThreadCreateRequest request = new ForumThreadCreateRequest();
        request.setTitle("New Discussion");
        request.setContent("Let's discuss this");
        request.setCategory("Technology");

        mockMvc.perform(post("/api/forum/threads")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Discussion"))
                .andExpect(jsonPath("$.category").value("Technology"));
    }

    @Test
    void shouldNotCreateThreadWithoutAuth() throws Exception {
        ForumThreadCreateRequest request = new ForumThreadCreateRequest();
        request.setTitle("New Discussion");
        request.setContent("Let's discuss this");
        request.setCategory("Technology");

        mockMvc.perform(post("/api/forum/threads")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // ===== THREAD: UPDATE (requires auth) =====

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldUpdateThread() throws Exception {
        ForumThreadUpdateRequest request = new ForumThreadUpdateRequest();
        request.setTitle("Updated Title");
        request.setContent("Updated content");

        mockMvc.perform(put("/api/forum/threads/" + testThread.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldNotUpdateNonExistentThread() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        ForumThreadUpdateRequest request = new ForumThreadUpdateRequest();
        request.setTitle("Updated Title");

        mockMvc.perform(put("/api/forum/threads/" + nonExistentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    // ===== THREAD: MODERATION (requires MODERATOR role) =====

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldPinThread() throws Exception {
        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/pin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pinned").value(true));
    }

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldUnpinThread() throws Exception {
        testThread.setPinned(true);
        forumThreadRepository.save(testThread);

        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/unpin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pinned").value(false));
    }

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldLockThread() throws Exception {
        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/lock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.locked").value(true));
    }

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldUnlockThread() throws Exception {
        testThread.setLocked(true);
        forumThreadRepository.save(testThread);

        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/unlock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.locked").value(false));
    }

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldDeleteThread() throws Exception {
        mockMvc.perform(delete("/api/forum/threads/" + testThread.getId()))
                .andExpect(status().isNoContent());

        assert forumThreadRepository.findById(testThread.getId()).isEmpty();
    }

    // ===== POST: PUBLIC GET ENDPOINTS =====

    @Test
    void shouldGetPostById() throws Exception {
        mockMvc.perform(get("/api/forum/posts/" + testPost.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testPost.getId().toString()))
                .andExpect(jsonPath("$.content").value("This is a test post"));
    }

    @Test
    void shouldGetPostByIdNotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(get("/api/forum/posts/" + nonExistentId))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetPostsByThread() throws Exception {
        mockMvc.perform(get("/api/forum/threads/" + testThread.getId() + "/posts?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].content").value("This is a test post"));
    }

    @Test
    void shouldGetPostsByAuthor() throws Exception {
        mockMvc.perform(get("/api/forum/posts/author/" + postAuthor.getId() + "?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].author.username").value("author"));
    }

    @Test
    void shouldGetPostCount() throws Exception {
        mockMvc.perform(get("/api/forum/threads/" + testThread.getId() + "/posts/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Posts: 1"));
    }

    @Test
    void shouldGetPostStats() throws Exception {
        mockMvc.perform(get("/api/forum/posts/" + testPost.getId() + "/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists());
    }

    // ===== POST: CREATE (requires auth) =====

    @Test
    @WithMockUser(username = "author", roles = "USER")
    void shouldCreatePost() throws Exception {
        ForumPostCreateRequest request = new ForumPostCreateRequest();
        request.setContent("This is a new post");

        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.content").value("This is a new post"));
    }

    @Test
    void shouldNotCreatePostWithoutAuth() throws Exception {
        ForumPostCreateRequest request = new ForumPostCreateRequest();
        request.setContent("This is a new post");

        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "author", roles = "USER")
    void shouldNotCreatePostInNonExistentThread() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        ForumPostCreateRequest request = new ForumPostCreateRequest();
        request.setContent("This is a new post");

        mockMvc.perform(post("/api/forum/threads/" + nonExistentId + "/posts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    // ===== POST: UPDATE (requires auth) =====

    @Test
    @WithMockUser(username = "author", roles = "USER")
    void shouldUpdatePost() throws Exception {
        ForumPostUpdateRequest request = new ForumPostUpdateRequest();
        request.setContent("Updated post content");

        mockMvc.perform(put("/api/forum/posts/" + testPost.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("Updated post content"));
    }

    @Test
    @WithMockUser(username = "author", roles = "USER")
    void shouldNotUpdateNonExistentPost() throws Exception {
        UUID nonExistentId = UUID.randomUUID();

        ForumPostUpdateRequest request = new ForumPostUpdateRequest();
        request.setContent("Updated content");

        mockMvc.perform(put("/api/forum/posts/" + nonExistentId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    // ===== POST: FLAG (requires auth) =====

    @Test
    @WithMockUser(username = "author", roles = "USER")
    void shouldFlagPost() throws Exception {
        mockMvc.perform(post("/api/forum/posts/" + testPost.getId() + "/flag?reason=Spam"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Post flagged for review"));
    }

    @Test
    void shouldNotFlagPostWithoutAuth() throws Exception {
        mockMvc.perform(post("/api/forum/posts/" + testPost.getId() + "/flag?reason=Spam"))
                .andExpect(status().isUnauthorized());
    }

    // ===== POST: DELETE (requires MODERATOR role) =====

    @Test
    @WithMockUser(username = "moderator", roles = "MODERATOR")
    void shouldDeletePost() throws Exception {
        mockMvc.perform(delete("/api/forum/posts/" + testPost.getId()))
                .andExpect(status().isNoContent());

        assert forumPostRepository.findById(testPost.getId()).isEmpty();
    }

    // ===== SECURITY TESTS =====

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldNotPinThreadWithoutModeratorRole() throws Exception {
        mockMvc.perform(post("/api/forum/threads/" + testThread.getId() + "/pin"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldNotDeleteThreadWithoutModeratorRole() throws Exception {
        mockMvc.perform(delete("/api/forum/threads/" + testThread.getId()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "creator", roles = "USER")
    void shouldNotDeletePostWithoutModeratorRole() throws Exception {
        mockMvc.perform(delete("/api/forum/posts/" + testPost.getId()))
                .andExpect(status().isForbidden());
    }
}
