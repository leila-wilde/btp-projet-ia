package com.archipellibre.controller;

import com.archipellibre.dto.ApiResponse;
import com.archipellibre.dto.EventCreateRequest;
import com.archipellibre.dto.EventResponse;
import com.archipellibre.dto.EventUpdateRequest;
import com.archipellibre.dto.UserResponse;
import com.archipellibre.model.Event;
import com.archipellibre.model.EventStatus;
import com.archipellibre.service.EventService;
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

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@Tag(name = "Event Management", description = "Event CRUD, registration, and capacity management")
@SecurityRequirement(name = "Bearer Authentication")
public class EventController {

    private final EventService eventService;

    // ===== CREATE ENDPOINTS =====

    @PostMapping
    @Operation(summary = "Create event", description = "Create a new event (user must be organizer)")
    public ResponseEntity<EventResponse> createEvent(
            @RequestParam UUID organizerId,
            @Valid @RequestBody EventCreateRequest request) {
        Event event = eventService.createEvent(organizerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(event));
    }

    // ===== GET ENDPOINTS =====

    @GetMapping("/{id}")
    @Operation(summary = "Get event by ID")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @GetMapping
    @Operation(summary = "Get all events", description = "Retrieve all events with pagination")
    public ResponseEntity<Page<EventResponse>> getAllEvents(Pageable pageable) {
        Page<Event> events = eventService.getAllEvents(pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get events by status")
    public ResponseEntity<Page<EventResponse>> getEventsByStatus(
            @PathVariable EventStatus status,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByStatus(status, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming events")
    public ResponseEntity<Page<EventResponse>> getUpcomingEvents(Pageable pageable) {
        Page<Event> events = eventService.getUpcomingEvents(pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/organizer/{organizerId}")
    @Operation(summary = "Get events by organizer")
    public ResponseEntity<Page<EventResponse>> getEventsByOrganizer(
            @PathVariable UUID organizerId,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByOrganizer(organizerId, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    @GetMapping("/participant/{userId}")
    @Operation(summary = "Get events user is participating in")
    public ResponseEntity<Page<EventResponse>> getEventsByParticipant(
            @PathVariable UUID userId,
            Pageable pageable) {
        Page<Event> events = eventService.getEventsByParticipant(userId, pageable);
        return ResponseEntity.ok(events.map(this::mapToResponse));
    }

    // ===== UPDATE ENDPOINTS =====

    @PutMapping("/{id}")
    @Operation(summary = "Update event", description = "Update event details (organizer only)")
    public ResponseEntity<EventResponse> updateEvent(
            @PathVariable UUID id,
            @Valid @RequestBody EventUpdateRequest request) {
        Event updated = eventService.updateEvent(id, request);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    // ===== REGISTRATION ENDPOINTS =====

    @PostMapping("/{eventId}/register/{userId}")
    @Operation(summary = "Register user for event")
    public ResponseEntity<EventResponse> registerForEvent(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        Event updated = eventService.registerUserForEvent(eventId, userId);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @PostMapping("/{eventId}/unregister/{userId}")
    @Operation(summary = "Unregister user from event")
    public ResponseEntity<EventResponse> unregisterFromEvent(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        Event updated = eventService.unregisterUserFromEvent(eventId, userId);
        return ResponseEntity.ok(mapToResponse(updated));
    }

    @GetMapping("/{eventId}/registered/{userId}")
    @Operation(summary = "Check if user is registered for event")
    public ResponseEntity<ApiResponse> isUserRegistered(
            @PathVariable UUID eventId,
            @PathVariable UUID userId) {
        boolean registered = eventService.isUserRegistered(eventId, userId);
        String message = registered ? "User is registered" : "User is not registered";
        return ResponseEntity.ok(new ApiResponse(true, message));
    }

    // ===== CAPACITY ENDPOINTS =====

    @GetMapping("/{id}/participants/count")
    @Operation(summary = "Get participant count")
    public ResponseEntity<ApiResponse> getParticipantCount(@PathVariable UUID id) {
        long count = eventService.getParticipantCount(id);
        return ResponseEntity.ok(new ApiResponse(true, "Participants: " + count));
    }

    @GetMapping("/{id}/capacity/remaining")
    @Operation(summary = "Get remaining capacity")
    public ResponseEntity<ApiResponse> getRemainingCapacity(@PathVariable UUID id) {
        int remaining = eventService.getRemainingCapacity(id);
        return ResponseEntity.ok(new ApiResponse(true, 
            remaining == Integer.MAX_VALUE ? "Unlimited capacity" : "Remaining: " + remaining));
    }

    @GetMapping("/{id}/is-full")
    @Operation(summary = "Check if event is full")
    public ResponseEntity<ApiResponse> isEventFull(@PathVariable UUID id) {
        boolean full = eventService.isEventFull(id);
        return ResponseEntity.ok(new ApiResponse(true, full ? "Event is full" : "Seats available"));
    }

    @GetMapping("/{id}/stats")
    @Operation(summary = "Get event statistics")
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
    @Operation(summary = "Start event (admin only)")
    public ResponseEntity<EventResponse> startEvent(@PathVariable UUID id) {
        Event started = eventService.startEvent(id);
        return ResponseEntity.ok(mapToResponse(started));
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Complete event (admin only)")
    public ResponseEntity<EventResponse> completeEvent(@PathVariable UUID id) {
        Event completed = eventService.completeEvent(id);
        return ResponseEntity.ok(mapToResponse(completed));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cancel event (admin only)")
    public ResponseEntity<EventResponse> cancelEvent(
            @PathVariable UUID id,
            @RequestParam(required = false) String reason) {
        Event cancelled = eventService.cancelEvent(id, reason != null ? reason : "No reason provided");
        return ResponseEntity.ok(mapToResponse(cancelled));
    }

    // ===== DELETE ENDPOINT =====

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete event (admin only)")
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
