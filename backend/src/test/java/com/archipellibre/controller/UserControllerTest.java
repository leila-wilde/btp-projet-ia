package com.archipellibre.controller;

import com.archipellibre.dto.ChangePasswordRequest;
import com.archipellibre.dto.LoginRequest;
import com.archipellibre.dto.RegisterRequest;
import com.archipellibre.dto.UserProfileRequest;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    // ===== HELPER METHODS =====

    private String registerAndLogin(String username, String email, String password) throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setUsername(username);
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsernameOrEmail(username);
        loginRequest.setPassword(password);

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").exists())
                .andReturn();

        String response = loginResult.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(response);
        return jsonNode.get("accessToken").asText();
    }

    private String createAdminUser() throws Exception {
        String username = "admin" + System.nanoTime();
        String email = "admin" + System.nanoTime() + "@example.com";
        String token = registerAndLogin(username, email, "AdminPassword123!");
        
        User user = userRepository.findByUsername(username).orElseThrow();
        user.setRole(UserRole.ADMIN);
        userRepository.save(user);
        
        return token;
    }

    // ===== PUBLIC CHECK ENDPOINTS (No auth required) =====

    @Test
    void shouldCheckUsernameAvailable() throws Exception {
        mockMvc.perform(get("/api/users/check/username?username=newusername"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Username available"));
    }

    @Test
    void shouldCheckUsernameNotAvailable() throws Exception {
        registerAndLogin("testuser", "test@example.com", "Password123!");

        mockMvc.perform(get("/api/users/check/username?username=testuser"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Username not available"));
    }

    @Test
    void shouldCheckEmailAvailable() throws Exception {
        mockMvc.perform(get("/api/users/check/email?email=newemail@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Email available"));
    }

    @Test
    void shouldCheckEmailNotAvailable() throws Exception {
        registerAndLogin("testuser", "test@example.com", "Password123!");

        mockMvc.perform(get("/api/users/check/email?email=test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Email not available"));
    }

    // ===== PROTECTED GET ENDPOINTS (requires auth) =====

    @Test
    void shouldGetUserByIdWithAuth() throws Exception {
        String token = registerAndLogin("testuser", "test@example.com", "Password123!");
        User user = userRepository.findByUsername("testuser").orElseThrow();

        mockMvc.perform(get("/api/users/" + user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.getId().toString()))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void shouldGetUserByIdNotFoundWithAuth() throws Exception {
        String token = registerAndLogin("testuser", "test@example.com", "Password123!");
        UUID nonExistentId = UUID.randomUUID();

        mockMvc.perform(get("/api/users/" + nonExistentId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetUserByUsernameWithAuth() throws Exception {
        String token = registerAndLogin("john_doe", "john@example.com", "Password123!");

        mockMvc.perform(get("/api/users/username/john_doe")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("john_doe"))
                .andExpect(jsonPath("$.email").value("john@example.com"));
    }

    @Test
    void shouldGetUserByUsernameNotFoundWithAuth() throws Exception {
        String token = registerAndLogin("testuser", "test@example.com", "Password123!");

        mockMvc.perform(get("/api/users/username/nonexistent")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldSearchUsersWithAuth() throws Exception {
        String token = registerAndLogin("alice", "alice@example.com", "Password123!");
        registerAndLogin("alicia", "alicia@example.com", "Password123!");
        registerAndLogin("bob", "bob@example.com", "Password123!");

        mockMvc.perform(get("/api/users/search?query=ali")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldSearchUsersReturnEmptyWithAuth() throws Exception {
        String token = registerAndLogin("testuser", "test@example.com", "Password123!");

        mockMvc.perform(get("/api/users/search?query=nonexistentuser123")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void shouldGetUserByIdWithoutAuth() throws Exception {
        registerAndLogin("testuser", "test@example.com", "Password123!");
        User user = userRepository.findByUsername("testuser").orElseThrow();

        mockMvc.perform(get("/api/users/" + user.getId()))
                .andExpect(status().isUnauthorized());
    }

    // ===== ADMIN-ONLY GET ENDPOINTS =====

    @Test
    void shouldGetAllUsersAsAdmin() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("user1", "user1@example.com", "Password123!");
        registerAndLogin("user2", "user2@example.com", "Password123!");

        mockMvc.perform(get("/api/users")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void shouldGetUserCount() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("user1", "user1@example.com", "Password123!");
        registerAndLogin("user2", "user2@example.com", "Password123!");

        mockMvc.perform(get("/api/users/stats/count")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User count: 3"));
    }

    @Test
    void shouldGetActiveUserCount() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("user1", "user1@example.com", "Password123!");

        mockMvc.perform(get("/api/users/stats/active-count")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Active user count: 2"));
    }

    // ===== UPDATE PROFILE (requires auth) =====

    @Test
    void shouldUpdateProfile() throws Exception {
        String token = registerAndLogin("profileuser", "profile@example.com", "Password123!");
        User user = userRepository.findByUsername("profileuser").orElseThrow();

        UserProfileRequest request = new UserProfileRequest();
        request.setUsername("profileuser_updated");
        request.setBio("Updated bio");
        request.setAvatarUrl("https://example.com/avatar.jpg");

        mockMvc.perform(put("/api/users/" + user.getId() + "/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.bio").value("Updated bio"))
                .andExpect(jsonPath("$.avatarUrl").value("https://example.com/avatar.jpg"));
    }

    @Test
    void shouldNotUpdateProfileWithoutAuthentication() throws Exception {
        UUID userId = UUID.randomUUID();
        UserProfileRequest request = new UserProfileRequest();
        request.setUsername("newname");

        mockMvc.perform(put("/api/users/" + userId + "/profile")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldNotUpdateProfileForNonExistentUser() throws Exception {
        String token = registerAndLogin("updater", "updater@example.com", "Password123!");
        UUID nonExistentId = UUID.randomUUID();

        UserProfileRequest request = new UserProfileRequest();
        request.setUsername("newname");

        mockMvc.perform(put("/api/users/" + nonExistentId + "/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    // ===== CHANGE PASSWORD (requires auth) =====

    @Test
    void shouldChangePassword() throws Exception {
        String token = registerAndLogin("passuser", "pass@example.com", "OldPassword123!");
        User user = userRepository.findByUsername("passuser").orElseThrow();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("OldPassword123!");
        request.setNewPassword("NewPassword123!");
        request.setConfirmPassword("NewPassword123!");

        mockMvc.perform(patch("/api/users/" + user.getId() + "/password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password changed successfully"));
    }

    @Test
    void shouldNotChangePasswordWithMismatchedConfirmation() throws Exception {
        String token = registerAndLogin("passuser2", "pass2@example.com", "Password123!");
        User user = userRepository.findByUsername("passuser2").orElseThrow();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("Password123!");
        request.setNewPassword("NewPassword123!");
        request.setConfirmPassword("DifferentPassword123!");

        mockMvc.perform(patch("/api/users/" + user.getId() + "/password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Password confirmation does not match"));
    }

    @Test
    void shouldNotChangePasswordWithWrongCurrentPassword() throws Exception {
        String token = registerAndLogin("passuser3", "pass3@example.com", "Password123!");
        User user = userRepository.findByUsername("passuser3").orElseThrow();

        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("WrongPassword123!");
        request.setNewPassword("NewPassword123!");
        request.setConfirmPassword("NewPassword123!");

        mockMvc.perform(patch("/api/users/" + user.getId() + "/password")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldNotChangePasswordWithoutAuthentication() throws Exception {
        UUID userId = UUID.randomUUID();
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("Password123!");
        request.setNewPassword("NewPassword123!");
        request.setConfirmPassword("NewPassword123!");

        mockMvc.perform(patch("/api/users/" + userId + "/password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // ===== ADMIN USER MANAGEMENT ENDPOINTS =====

    @Test
    void shouldPromoteToModerator() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("promotee", "promotee@example.com", "Password123!");
        User user = userRepository.findByUsername("promotee").orElseThrow();

        mockMvc.perform(post("/api/users/" + user.getId() + "/promote")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.role").value("MODERATOR"));
    }

    @Test
    void shouldDeactivateUser() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("usertoblock", "block@example.com", "Password123!");
        User user = userRepository.findByUsername("usertoblock").orElseThrow();

        mockMvc.perform(post("/api/users/" + user.getId() + "/deactivate")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        User deactivated = userRepository.findById(user.getId()).orElseThrow();
        assert !deactivated.getActive();
    }

    @Test
    void shouldResetPassword() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("passreset", "reset@example.com", "Password123!");
        User user = userRepository.findByUsername("passreset").orElseThrow();

        mockMvc.perform(post("/api/users/" + user.getId() + "/reset-password")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void shouldDeleteUser() throws Exception {
        String adminToken = createAdminUser();
        registerAndLogin("userdelete", "delete@example.com", "Password123!");
        User user = userRepository.findByUsername("userdelete").orElseThrow();

        mockMvc.perform(delete("/api/users/" + user.getId())
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());

        assert userRepository.findById(user.getId()).isEmpty();
    }

    // ===== RESPONSE VALIDATION TESTS =====

    @Test
    void shouldNotExposePasswordInResponse() throws Exception {
        String token = registerAndLogin("secureuser", "secure@example.com", "Password123!");
        User user = userRepository.findByUsername("secureuser").orElseThrow();

        mockMvc.perform(get("/api/users/" + user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    void shouldReturnAllUserFields() throws Exception {
        String token = registerAndLogin("fulluser", "full@example.com", "Password123!");
        User user = userRepository.findByUsername("fulluser").orElseThrow();

        mockMvc.perform(get("/api/users/" + user.getId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").exists())
                .andExpect(jsonPath("$.email").exists())
                .andExpect(jsonPath("$.role").exists())
                .andExpect(jsonPath("$.active").exists())
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.updatedAt").exists());
    }
}

