package com.archipellibre.controller;

import com.archipellibre.dto.ApiResponse;
import com.archipellibre.dto.EventCreateRequest;
import com.archipellibre.dto.EventResponse;
import com.archipellibre.dto.EventUpdateRequest;
import com.archipellibre.dto.UserResponse;
import com.archipellibre.model.Event;
import com.archipellibre.model.EventStatus;
import com.archipellibre.model.User;
import com.archipellibre.repository.UserRepository;
import com.archipellibre.service.EventService;
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

import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final UserRepository userRepository;

    // ===== CREATE ENDPOINTS =====

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(null);
        }
        
        String username = authentication.getName();
        User organizer = userRepository.findByUsername(username)
                .orElseThrow(() -> new org.springframework.security.core.userdetails.UsernameNotFoundException("User not found"));
        
        Event event = eventService.createEvent(organizer.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(event));
    }

    // ===== GET ENDPOINTS =====

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping
    public ResponseEntity<Page<EventResponse>> getAllEvents(Pageable pageable) {
        Page<Event> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<EventResponse>> getEventsByStatus(
            @PathVariable EventStatus status,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByStatus(status, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<Page<EventResponse>> getUpcomingEvents(Pageable pageable) {
        Page<Event> events = eventService.getUpcomingEvents(pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<Page<EventResponse>> getEventsByOrganizer(
            @PathVariable UUID organizerId,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByOrganizer(organizerId, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/participant/{userId}")
    public ResponseEntity<Page<EventResponse>> getEventsByParticipant(
            @PathVariable UUID userId,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByParticipant(userId, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    // ===== UPDATE ENDPOINTS =====

    @PutMapping("/{id}")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventUpdateRequest request) {
        Event updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    // ===== REGISTRATION ENDPOINTS =====

    @PostMapping("/{eventId}/register/{userId}")
    public ResponseEntity<EventResponse> registerForEvent(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        Event updated = eventService.registerUserForEvent(eventId, userId);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @PostMapping("/{eventId}/unregister/{userId}")
    public ResponseEntity<EventResponse> unregisterFromEvent(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        Event updated = eventService.unregisterUserFromEvent(eventId, userId);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @GetMapping("/{eventId}/registered/{userId}")
    public ResponseEntity<ApiResponse> isUserRegistered(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        boolean registered = eventService.isUserRegistered(eventId, userId);
        String message = registered ? "User is registered" : "User is not registered";
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    // ===== CAPACITY ENDPOINTS =====

    @GetMapping("/{id}/participants/count")
    public ResponseEntity<ApiResponse> getParticipantCount(@PathVariable UUID id) {
        long count = eventService.getParticipantCount(id);
        return ResponseEntity.ok(new ApiResponse(true, "Participants: " + count));
    }

    @GetMapping("/{id}/capacity/remaining")
    public ResponseEntity<ApiResponse> getRemainingCapacity(@PathVariable UUID id) {
        int remaining = eventService.getRemainingCapacity(id);
        return ResponseEntity.ok(new ApiResponse(true, 
            remaining == Integer.MAX_VALUE ? "Unlimited capacity" : "Remaining: " + remaining));
    }

    @GetMapping("/{id}/is-full")
    public ResponseEntity<ApiResponse> isEventFull(@PathVariable UUID id) {
        boolean full = eventService.isEventFull(id);
        return ResponseEntity.ok(new ApiResponse(true, full ? "Event is full" : "Seats available"));
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<ApiResponse> getEventStats(@PathVariable UUID id) {
        var stats = eventService.getEventStats(id);
        String message = String.format(
            "Participants: %d/%s, Available: %d, Status: %s",
            stats.getParticipantCount(),
            stats.getMaxCapacity() == Integer.MAX_VALUE ? "Unlimited" : stats.getMaxCapacity(),
            stats.getRemainingCapacity(),
            stats.getStatus()
        );
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    // ===== STATUS ENDPOINTS =====

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> startEvent(@PathVariable UUID id) {
        Event started = eventService.startEvent(id);
        return ResponseEntity.ok(mapToResponse(started));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> completeEvent(@PathVariable UUID id) {
        Event completed = eventService.completeEvent(id);
        return ResponseEntity.ok(mapToResponse(completed));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> cancelEvent(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        Event cancelled = eventService.cancelEvent(id, reason != null ? reason : "No reason provided");
        return ResponseEntity.ok(mapToResponse(cancelled));
    }

    // ===== DELETE ENDPOINT =====

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
                .body(new ApiResponse(true, "Event deleted successfully"));
    }

    // ===== HELPER METHOD =====

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .location(event.getLocation())
                .imageUrl(event.getImageUrl())
                .maxParticipants(event.getMaxParticipants())
                .participantCount(event.getParticipants().size())
                .status(event.getStatus())
                .organizer(mapUserToResponse(event.getOrganizer()))
                .participants(event.getParticipants().stream()
                        .map(this::mapUserToResponse)
                        .toList())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
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
