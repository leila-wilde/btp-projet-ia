package com.archipellibre.controller;

import com.archipellibre.dto.ApiResponse;
import com.archipellibre.dto.ChangePasswordRequest;
import com.archipellibre.dto.UserProfileRequest;
import com.archipellibre.dto.UserResponse;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "User profile and account management endpoints")
@SecurityRequirement(name = "Bearer Authentication")
public class UserController {

    private final UserService userService;

    // ===== GET ENDPOINTS =====

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve user details by their ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable UUID id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Get user by username")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(mapToResponse(user));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by username", description = "Search for users by partial username match")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String query) {
        List<User> users = userService.searchUsersByUsername(query);
        return ResponseEntity.ok(users.stream().map(this::mapToResponse).toList());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all active users", description = "Retrieve all active users (admin only)")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllActiveUsers();
        return ResponseEntity.ok(users.stream().map(this::mapToResponse).toList());
    }

    @GetMapping("/role/{role}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get users by role", description = "Retrieve all users with a specific role (admin only)")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable UserRole role) {
        List<User> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users.stream().map(this::mapToResponse).toList());
    }

    @GetMapping("/stats/count")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get user count", description = "Get total user count (admin only)")
    public ResponseEntity<ApiResponse> getUserCount() {
        long count = userService.getUserCount();
        return ResponseEntity.ok(new ApiResponse(true, "User count: " + count));
    }

    @GetMapping("/stats/active-count")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get active user count", description = "Get count of active users (admin only)")
    public ResponseEntity<ApiResponse> getActiveUserCount() {
        long count = userService.getActiveUserCount();
        return ResponseEntity.ok(new ApiResponse(true, "Active user count: " + count));
    }

    // ===== UPDATE ENDPOINTS =====

    @PutMapping("/{id}/profile")
    @Operation(summary = "Update user profile", description = "Update username, bio, or avatar")
    public ResponseEntity<UserResponse> updateProfile(
            @PathVariable UUID id,
            @Valid @RequestBody UserProfileRequest request) {
        User updatedUser = userService.updateProfile(id, request);
        return ResponseEntity.ok(mapToResponse(updatedUser));
    }

    @PatchMapping("/{id}/password")
    @Operation(summary = "Change user password", description = "Change password with current password verification")
    public ResponseEntity<ApiResponse> changePassword(
            @PathVariable UUID id,
            @Valid @RequestBody ChangePasswordRequest request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Password confirmation does not match"));
        }

        userService.changePassword(id, request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
    }

    // ===== ADMIN ENDPOINTS =====

    @PostMapping("/{id}/promote")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Promote user to moderator", description = "Promote a regular user to moderator role (admin only)")
    public ResponseEntity<UserResponse> promoteToModerator(@PathVariable UUID id) {
        User promoted = userService.promoteToModerator(id);
        return ResponseEntity.ok(mapToResponse(promoted));
    }

    @PostMapping("/{id}/demote")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Demote moderator to user", description = "Demote a moderator back to regular user (admin only)")
    public ResponseEntity<UserResponse> demoteToUser(@PathVariable UUID id) {
        User demoted = userService.demoteToUser(id);
        return ResponseEntity.ok(mapToResponse(demoted));
    }

    @PostMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate user account", description = "Deactivate a user account (admin only)")
    public ResponseEntity<ApiResponse> deactivateUser(@PathVariable UUID id) {
        userService.deactivateUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User deactivated successfully"));
    }

    @PostMapping("/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reset user password", description = "Generate temporary password for user (admin only)")
    public ResponseEntity<ApiResponse> resetPassword(@PathVariable UUID id) {
        String tempPassword = userService.resetPassword(id);
        return ResponseEntity.ok(new ApiResponse(true, "Temporary password: " + tempPassword));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete user", description = "Permanently delete a user account (admin only)")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "User deleted successfully"));
    }

    @GetMapping("/check/username")
    @Operation(summary = "Check username availability", description = "Check if a username is available")
    public ResponseEntity<ApiResponse> isUsernameAvailable(@RequestParam String username) {
        boolean available = userService.isUsernameAvailable(username);
        return ResponseEntity.ok(new ApiResponse(true, "Username " + (available ? "available" : "not available")));
    }

    @GetMapping("/check/email")
    @Operation(summary = "Check email availability", description = "Check if an email is available")
    public ResponseEntity<ApiResponse> isEmailAvailable(@RequestParam String email) {
        boolean available = userService.isEmailAvailable(email);
        return ResponseEntity.ok(new ApiResponse(true, "Email " + (available ? "available" : "not available")));
    }

    // ===== HELPER METHOD =====

    private UserResponse mapToResponse(User user) {
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
