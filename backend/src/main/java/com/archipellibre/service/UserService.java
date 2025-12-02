package com.archipellibre.service;

import com.archipellibre.dto.UserProfileRequest;
import com.archipellibre.exception.ResourceNotFoundException;
import com.archipellibre.exception.BusinessLogicException;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Get user by ID
     */
    public User getUserById(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
    }

    /**
     * Get user by username
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));
    }

    /**
     * Get user by email
     */
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    /**
     * Get all active users
     */
    @Transactional(readOnly = true)
    public List<User> getAllActiveUsers() {
        return userRepository.findAll().stream()
                .filter(User::getActive)
                .toList();
    }

    /**
     * Search users by username (case-insensitive)
     */
    @Transactional(readOnly = true)
    public List<User> searchUsersByUsername(String username) {
        return userRepository.findAll().stream()
                .filter(u -> u.getActive() && u.getUsername().toLowerCase().contains(username.toLowerCase()))
                .toList();
    }

    /**
     * Get all users with a specific role
     */
    @Transactional(readOnly = true)
    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() == role && u.getActive())
                .toList();
    }

    /**
     * Update user profile (username, bio, avatar)
     */
    public User updateProfile(UUID userId, UserProfileRequest profileRequest) {
        User user = getUserById(userId);

        if (profileRequest.getUsername() != null && !profileRequest.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(profileRequest.getUsername())) {
                throw new BusinessLogicException("Username already exists: " + profileRequest.getUsername());
            }
            user.setUsername(profileRequest.getUsername());
        }

        if (profileRequest.getBio() != null) {
            user.setBio(profileRequest.getBio());
        }

        if (profileRequest.getAvatarUrl() != null) {
            user.setAvatarUrl(profileRequest.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);
        log.info("User profile updated: {}", userId);
        return updatedUser;
    }

    /**
     * Change user password
     */
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = getUserById(userId);

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BusinessLogicException("Current password is incorrect");
        }

        if (currentPassword.equals(newPassword)) {
            throw new BusinessLogicException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed for user: {}", userId);
    }

    /**
     * Reset user password (admin only - sets temporary password)
     */
    public String resetPassword(UUID userId) {
        User user = getUserById(userId);

        String temporaryPassword = generateTemporaryPassword();
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        userRepository.save(user);

        log.info("Password reset for user: {}", userId);
        return temporaryPassword;
    }

    /**
     * Promote user to moderator
     */
    public User promoteToModerator(UUID userId) {
        User user = getUserById(userId);

        if (user.getRole() == UserRole.MODERATOR) {
            throw new BusinessLogicException("User is already a moderator");
        }

        user.setRole(UserRole.MODERATOR);
        User updated = userRepository.save(user);
        log.info("User promoted to moderator: {}", userId);
        return updated;
    }

    /**
     * Demote moderator to regular user
     */
    public User demoteToUser(UUID userId) {
        User user = getUserById(userId);

        if (user.getRole() == UserRole.USER) {
            throw new BusinessLogicException("User is already a regular user");
        }

        user.setRole(UserRole.USER);
        User updated = userRepository.save(user);
        log.info("User demoted to regular user: {}", userId);
        return updated;
    }

    /**
     * Deactivate user account
     */
    public void deactivateUser(UUID userId) {
        User user = getUserById(userId);

        if (!user.getActive()) {
            throw new BusinessLogicException("User account is already deactivated");
        }

        user.setActive(false);
        userRepository.save(user);
        log.info("User account deactivated: {}", userId);
    }

    /**
     * Reactivate user account
     */
    public User reactivateUser(UUID userId) {
        User user = getUserById(userId);

        if (user.getActive()) {
            throw new BusinessLogicException("User account is already active");
        }

        user.setActive(true);
        User updated = userRepository.save(user);
        log.info("User account reactivated: {}", userId);
        return updated;
    }

    /**
     * Delete user (hard delete)
     */
    public void deleteUser(UUID userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
        log.info("User deleted: {}", userId);
    }

    /**
     * Check if username is available
     */
    @Transactional(readOnly = true)
    public boolean isUsernameAvailable(String username) {
        return !userRepository.existsByUsername(username);
    }

    /**
     * Check if email is available
     */
    @Transactional(readOnly = true)
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    /**
     * Get user count
     */
    @Transactional(readOnly = true)
    public long getUserCount() {
        return userRepository.count();
    }

    /**
     * Get active user count
     */
    @Transactional(readOnly = true)
    public long getActiveUserCount() {
        return userRepository.findAll().stream()
                .filter(User::getActive)
                .count();
    }

    /**
     * Check user permissions
     */
    @Transactional(readOnly = true)
    public boolean hasPermission(UUID userId, String permission) {
        User user = getUserById(userId);
        return user.getRole().hasPermission(permission);
    }

    /**
     * Check if user is admin
     */
    @Transactional(readOnly = true)
    public boolean isAdmin(UUID userId) {
        User user = getUserById(userId);
        return user.getRole() == UserRole.ADMIN;
    }

    /**
     * Check if user is moderator or admin
     */
    @Transactional(readOnly = true)
    public boolean isModerator(UUID userId) {
        User user = getUserById(userId);
        return user.getRole() == UserRole.MODERATOR || user.getRole() == UserRole.ADMIN;
    }

    // Helper methods

    /**
     * Generate temporary password for password reset
     */
    private String generateTemporaryPassword() {
        return "TEMP_" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
