package com.archipellibre.service;

import com.archipellibre.dto.UserProfileRequest;
import com.archipellibre.exception.BusinessLogicException;
import com.archipellibre.exception.ResourceNotFoundException;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("UserService Integration Tests")
@SuppressWarnings("null")
class UserServiceTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private User testModerator;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        testUser = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .passwordHash(passwordEncoder.encode("SecurePassword123!"))
                .role(UserRole.USER)
                .bio("Test bio")
                .active(true)
                .build();

        testModerator = User.builder()
                .username("testmod")
                .email("testmod@example.com")
                .passwordHash(passwordEncoder.encode("ModPassword123!"))
                .role(UserRole.MODERATOR)
                .active(true)
                .build();

        userRepository.save(testUser);
        userRepository.save(testModerator);
    }

    // ===== GET TESTS =====

    @Test
    @DisplayName("Should get user by ID")
    void testGetUserById() {
        User found = userService.getUserById(testUser.getId());

        assertNotNull(found);
        assertEquals(testUser.getId(), found.getId());
        assertEquals("testuser", found.getUsername());
    }

    @Test
    @DisplayName("Should throw exception when user not found by ID")
    void testGetUserByIdNotFound() {
        UUID invalidId = UUID.randomUUID();

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(invalidId));
    }

    @Test
    @DisplayName("Should get user by username")
    void testGetUserByUsername() {
        User found = userService.getUserByUsername("testuser");

        assertNotNull(found);
        assertEquals("testuser", found.getUsername());
    }

    @Test
    @DisplayName("Should throw exception when user not found by username")
    void testGetUserByUsernameNotFound() {
        assertThrows(ResourceNotFoundException.class, () -> userService.getUserByUsername("nonexistent"));
    }

    @Test
    @DisplayName("Should get user by email")
    void testGetUserByEmail() {
        User found = userService.getUserByEmail("testuser@example.com");

        assertNotNull(found);
        assertEquals("testuser@example.com", found.getEmail());
    }

    @Test
    @DisplayName("Should get all active users")
    void testGetAllActiveUsers() {
        User inactiveUser = User.builder()
                .username("inactive")
                .email("inactive@example.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(UserRole.USER)
                .active(false)
                .build();
        userRepository.save(inactiveUser);

        List<User> activeUsers = userService.getAllActiveUsers();

        assertEquals(2, activeUsers.size());
        assertTrue(activeUsers.stream().allMatch(User::getActive));
    }

    @Test
    @DisplayName("Should search users by username")
    void testSearchUsersByUsername() {
        List<User> results = userService.searchUsersByUsername("test");

        assertEquals(2, results.size());
        assertTrue(results.stream().allMatch(u -> u.getUsername().contains("test")));
    }

    @Test
    @DisplayName("Should get users by role")
    void testGetUsersByRole() {
        List<User> users = userService.getUsersByRole(UserRole.USER);
        List<User> moderators = userService.getUsersByRole(UserRole.MODERATOR);

        assertEquals(1, users.size());
        assertEquals(1, moderators.size());
        assertEquals(UserRole.USER, users.get(0).getRole());
        assertEquals(UserRole.MODERATOR, moderators.get(0).getRole());
    }

    // ===== UPDATE PROFILE TESTS =====

    @Test
    @DisplayName("Should update user profile")
    void testUpdateProfile() {
        UserProfileRequest request = UserProfileRequest.builder()
                .username("newusername")
                .bio("Updated bio")
                .avatarUrl("http://example.com/avatar.jpg")
                .build();

        User updated = userService.updateProfile(testUser.getId(), request);

        assertEquals("newusername", updated.getUsername());
        assertEquals("Updated bio", updated.getBio());
        assertEquals("http://example.com/avatar.jpg", updated.getAvatarUrl());
    }

    @Test
    @DisplayName("Should throw exception when updating profile with duplicate username")
    void testUpdateProfileDuplicateUsername() {
        UserProfileRequest request = UserProfileRequest.builder()
                .username("testmod")
                .build();

        assertThrows(BusinessLogicException.class, () -> userService.updateProfile(testUser.getId(), request));
    }

    @Test
    @DisplayName("Should update profile with null fields (partial update)")
    void testUpdateProfilePartial() {
        UserProfileRequest request = UserProfileRequest.builder()
                .bio("New bio only")
                .build();

        User updated = userService.updateProfile(testUser.getId(), request);

        assertEquals("testuser", updated.getUsername());
        assertEquals("New bio only", updated.getBio());
    }

    // ===== PASSWORD TESTS =====

    @Test
    @DisplayName("Should change user password")
    void testChangePassword() {
        userService.changePassword(testUser.getId(), "SecurePassword123!", "NewPassword456!");

        User user = userService.getUserById(testUser.getId());
        assertTrue(passwordEncoder.matches("NewPassword456!", user.getPasswordHash()));
        assertFalse(passwordEncoder.matches("SecurePassword123!", user.getPasswordHash()));
    }

    @Test
    @DisplayName("Should throw exception when current password is incorrect")
    void testChangePasswordWrongCurrent() {
        assertThrows(BusinessLogicException.class,
                () -> userService.changePassword(testUser.getId(), "WrongPassword", "NewPassword456!"));
    }

    @Test
    @DisplayName("Should throw exception when new password equals current password")
    void testChangePasswordSamePassword() {
        assertThrows(BusinessLogicException.class,
                () -> userService.changePassword(testUser.getId(), "SecurePassword123!", "SecurePassword123!"));
    }

    @Test
    @DisplayName("Should reset user password")
    void testResetPassword() {
        String tempPassword = userService.resetPassword(testUser.getId());

        assertNotNull(tempPassword);
        assertTrue(tempPassword.startsWith("TEMP_"));

        User user = userService.getUserById(testUser.getId());
        assertTrue(passwordEncoder.matches(tempPassword, user.getPasswordHash()));
    }

    // ===== ROLE MANAGEMENT TESTS =====

    @Test
    @DisplayName("Should promote user to moderator")
    void testPromoteToModerator() {
        User promoted = userService.promoteToModerator(testUser.getId());

        assertEquals(UserRole.MODERATOR, promoted.getRole());

        User reloaded = userService.getUserById(testUser.getId());
        assertEquals(UserRole.MODERATOR, reloaded.getRole());
    }

    @Test
    @DisplayName("Should throw exception when promoting already moderator")
    void testPromoteModeratorFail() {
        assertThrows(BusinessLogicException.class, () -> userService.promoteToModerator(testModerator.getId()));
    }

    @Test
    @DisplayName("Should demote moderator to user")
    void testDemoteToUser() {
        User demoted = userService.demoteToUser(testModerator.getId());

        assertEquals(UserRole.USER, demoted.getRole());
    }

    @Test
    @DisplayName("Should throw exception when demoting already regular user")
    void testDemoteUserFail() {
        assertThrows(BusinessLogicException.class, () -> userService.demoteToUser(testUser.getId()));
    }

    // ===== DEACTIVATION TESTS =====

    @Test
    @DisplayName("Should deactivate user account")
    void testDeactivateUser() {
        userService.deactivateUser(testUser.getId());

        User user = userService.getUserById(testUser.getId());
        assertFalse(user.getActive());
    }

    @Test
    @DisplayName("Should throw exception when deactivating already inactive user")
    void testDeactivateAlreadyInactive() {
        userService.deactivateUser(testUser.getId());

        assertThrows(BusinessLogicException.class, () -> userService.deactivateUser(testUser.getId()));
    }

    @Test
    @DisplayName("Should reactivate user account")
    void testReactivateUser() {
        userService.deactivateUser(testUser.getId());

        User reactivated = userService.reactivateUser(testUser.getId());

        assertTrue(reactivated.getActive());
    }

    @Test
    @DisplayName("Should throw exception when reactivating already active user")
    void testReactivateActiveUserFail() {
        assertThrows(BusinessLogicException.class, () -> userService.reactivateUser(testUser.getId()));
    }

    // ===== DELETE TESTS =====

    @Test
    @DisplayName("Should delete user")
    void testDeleteUser() {
        UUID userId = testUser.getId();
        userService.deleteUser(userId);

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(userId));
    }

    // ===== AVAILABILITY TESTS =====

    @Test
    @DisplayName("Should check username availability")
    void testIsUsernameAvailable() {
        assertTrue(userService.isUsernameAvailable("newusername"));
        assertFalse(userService.isUsernameAvailable("testuser"));
    }

    @Test
    @DisplayName("Should check email availability")
    void testIsEmailAvailable() {
        assertTrue(userService.isEmailAvailable("newemail@example.com"));
        assertFalse(userService.isEmailAvailable("testuser@example.com"));
    }

    // ===== COUNT TESTS =====

    @Test
    @DisplayName("Should get user count")
    void testGetUserCount() {
        long count = userService.getUserCount();
        assertEquals(2, count);
    }

    @Test
    @DisplayName("Should get active user count")
    void testGetActiveUserCount() {
        User inactiveUser = User.builder()
                .username("inactive")
                .email("inactive@example.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(UserRole.USER)
                .active(false)
                .build();
        userRepository.save(inactiveUser);

        long activeCount = userService.getActiveUserCount();
        assertEquals(2, activeCount);
    }

    // ===== PERMISSION TESTS =====

    @Test
    @DisplayName("Should check user permissions correctly")
    void testHasPermission() {
        assertTrue(userService.hasPermission(testUser.getId(), "VIEW_PROFILE"));
        assertTrue(userService.hasPermission(testUser.getId(), "CREATE_CONTENT"));
        assertFalse(userService.hasPermission(testUser.getId(), "DELETE_USER"));
    }

    @Test
    @DisplayName("Should check if user is admin")
    void testIsAdmin() {
        assertFalse(userService.isAdmin(testUser.getId()));

        User admin = User.builder()
                .username("admin")
                .email("admin@example.com")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .role(UserRole.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        assertTrue(userService.isAdmin(admin.getId()));
    }

    @Test
    @DisplayName("Should check if user is moderator or admin")
    void testIsModerator() {
        assertFalse(userService.isModerator(testUser.getId()));
        assertTrue(userService.isModerator(testModerator.getId()));

        User admin = User.builder()
                .username("admin")
                .email("admin@example.com")
                .passwordHash(passwordEncoder.encode("AdminPass123!"))
                .role(UserRole.ADMIN)
                .active(true)
                .build();
        userRepository.save(admin);

        assertTrue(userService.isModerator(admin.getId()));
    }
}
