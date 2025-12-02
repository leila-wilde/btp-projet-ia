package com.archipellibre.service;

import com.archipellibre.dto.EventCreateRequest;
import com.archipellibre.dto.EventUpdateRequest;
import com.archipellibre.exception.BusinessLogicException;
import com.archipellibre.exception.ResourceNotFoundException;
import com.archipellibre.model.Event;
import com.archipellibre.model.EventStatus;
import com.archipellibre.model.User;
import com.archipellibre.repository.EventRepository;
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
public class EventService {

    private final EventRepository eventRepository;
    private final UserService userService;

    /**
     * Create a new event
     */
    public Event createEvent(UUID organizerId, EventCreateRequest request) {
        User organizer = userService.getUserById(organizerId);

        if (request.getStartTime().isBefore(LocalDateTime.now())) {
            throw new BusinessLogicException("Event start time cannot be in the past");
        }

        if (request.getEndTime().isBefore(request.getStartTime())) {
            throw new BusinessLogicException("Event end time must be after start time");
        }

        if (request.getMaxParticipants() != null && request.getMaxParticipants() < 0) {
            throw new BusinessLogicException("Max participants cannot be negative");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .maxParticipants(request.getMaxParticipants() == null ? 0 : request.getMaxParticipants())
                .organizer(organizer)
                .status(EventStatus.SCHEDULED)
                .build();

        Event savedEvent = eventRepository.save(event);
        log.info("Event created: {} by user: {}", savedEvent.getId(), organizerId);
        return savedEvent;
    }

    /**
     * Get event by ID
     */
    public Event getEventById(UUID eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + eventId));
    }

    /**
     * Get all events with pagination
     */
    @Transactional(readOnly = true)
    public Page<Event> getAllEvents(Pageable pageable) {
        return eventRepository.findAll(pageable);
    }

    /**
     * Get events by status
     */
    @Transactional(readOnly = true)
    public Page<Event> getEventsByStatus(EventStatus status, Pageable pageable) {
        return eventRepository.findByStatus(status, pageable);
    }

    /**
     * Get upcoming events (scheduled and in progress)
     */
    @Transactional(readOnly = true)
    public Page<Event> getUpcomingEvents(Pageable pageable) {
        LocalDateTime now = LocalDateTime.now();
        // Get all events and filter in-memory (simpler approach without Specification)
        var allEvents = eventRepository.findAll(pageable);
        var upcoming = allEvents.getContent().stream()
                .filter(e -> e.getEndTime().isAfter(now) && 
                        (e.getStatus() == EventStatus.SCHEDULED || e.getStatus() == EventStatus.IN_PROGRESS))
                .toList();
        // Note: For production, extend JpaSpecificationExecutor for proper database filtering
        return new org.springframework.data.domain.PageImpl<>(upcoming, pageable, upcoming.size());
    }

    /**
     * Get events created by user
     */
    @Transactional(readOnly = true)
    public Page<Event> getEventsByOrganizer(UUID organizerId, Pageable pageable) {
        userService.getUserById(organizerId); // Verify user exists
        return eventRepository.findByOrganizerId(organizerId, pageable);
    }

    /**
     * Get events user is participating in
     */
    @Transactional(readOnly = true)
    public Page<Event> getEventsByParticipant(UUID userId, Pageable pageable) {
        userService.getUserById(userId); // Verify user exists
        return eventRepository.findEventsByParticipantId(userId, pageable);
    }

    /**
     * Get events between dates
     */
    @Transactional(readOnly = true)
    public List<Event> getEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessLogicException("Start date must be before end date");
        }
        return eventRepository.findEventsBetweenDates(startDate, endDate);
    }

    /**
     * Update event details
     */
    public Event updateEvent(UUID eventId, EventUpdateRequest request) {
        Event event = getEventById(eventId);

        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new BusinessLogicException("Cannot update completed event");
        }

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BusinessLogicException("Cannot update cancelled event");
        }

        if (request.getTitle() != null) {
            event.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            event.setDescription(request.getDescription());
        }

        if (request.getStartTime() != null) {
            if (request.getStartTime().isBefore(LocalDateTime.now())) {
                throw new BusinessLogicException("Event start time cannot be in the past");
            }
            event.setStartTime(request.getStartTime());
        }

        if (request.getEndTime() != null) {
            LocalDateTime startTime = request.getStartTime() != null ? 
                request.getStartTime() : event.getStartTime();
            if (request.getEndTime().isBefore(startTime)) {
                throw new BusinessLogicException("Event end time must be after start time");
            }
            event.setEndTime(request.getEndTime());
        }

        if (request.getLocation() != null) {
            event.setLocation(request.getLocation());
        }

        if (request.getImageUrl() != null) {
            event.setImageUrl(request.getImageUrl());
        }

        if (request.getMaxParticipants() != null) {
            if (request.getMaxParticipants() < 0) {
                throw new BusinessLogicException("Max participants cannot be negative");
            }
            if (request.getMaxParticipants() > 0 && 
                event.getParticipants().size() > request.getMaxParticipants()) {
                throw new BusinessLogicException(
                    "Cannot reduce capacity below current participant count");
            }
            event.setMaxParticipants(request.getMaxParticipants());
        }

        Event updated = eventRepository.save(event);
        log.info("Event updated: {}", eventId);
        return updated;
    }

    /**
     * Register user for event
     */
    public Event registerUserForEvent(UUID eventId, UUID userId) {
        Event event = getEventById(eventId);
        User user = userService.getUserById(userId);

        if (event.getStatus() == EventStatus.CANCELLED) {
            throw new BusinessLogicException("Cannot register for cancelled event");
        }

        if (event.getParticipants().contains(user)) {
            throw new BusinessLogicException("User already registered for this event");
        }

        if (event.isFull()) {
            throw new BusinessLogicException("Event is at full capacity");
        }

        event.getParticipants().add(user);
        Event updated = eventRepository.save(event);
        log.info("User {} registered for event {}", userId, eventId);
        return updated;
    }

    /**
     * Unregister user from event
     */
    public Event unregisterUserFromEvent(UUID eventId, UUID userId) {
        Event event = getEventById(eventId);
        User user = userService.getUserById(userId);

        if (!event.getParticipants().contains(user)) {
            throw new BusinessLogicException("User is not registered for this event");
        }

        event.getParticipants().remove(user);
        Event updated = eventRepository.save(event);
        log.info("User {} unregistered from event {}", userId, eventId);
        return updated;
    }

    /**
     * Check if user is registered for event
     */
    @Transactional(readOnly = true)
    public boolean isUserRegistered(UUID eventId, UUID userId) {
        Event event = getEventById(eventId);
        return event.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(userId));
    }

    /**
     * Get participant count
     */
    @Transactional(readOnly = true)
    public long getParticipantCount(UUID eventId) {
        Event event = getEventById(eventId);
        return event.getParticipants().size();
    }

    /**
     * Get remaining capacity
     */
    @Transactional(readOnly = true)
    public int getRemainingCapacity(UUID eventId) {
        Event event = getEventById(eventId);
        if (event.getMaxParticipants() == 0) {
            return Integer.MAX_VALUE; // Unlimited
        }
        return event.getMaxParticipants() - event.getParticipants().size();
    }

    /**
     * Check if event is full
     */
    @Transactional(readOnly = true)
    public boolean isEventFull(UUID eventId) {
        Event event = getEventById(eventId);
        return event.isFull();
    }

    /**
     * Start event
     */
    public Event startEvent(UUID eventId) {
        Event event = getEventById(eventId);

        if (event.getStatus() != EventStatus.SCHEDULED) {
            throw new BusinessLogicException("Only scheduled events can be started");
        }

        if (LocalDateTime.now().isBefore(event.getStartTime())) {
            throw new BusinessLogicException("Cannot start event before scheduled start time");
        }

        event.setStatus(EventStatus.IN_PROGRESS);
        Event updated = eventRepository.save(event);
        log.info("Event started: {}", eventId);
        return updated;
    }

    /**
     * Complete event
     */
    public Event completeEvent(UUID eventId) {
        Event event = getEventById(eventId);

        if (event.getStatus() != EventStatus.IN_PROGRESS) {
            throw new BusinessLogicException("Only in-progress events can be completed");
        }

        event.setStatus(EventStatus.COMPLETED);
        Event updated = eventRepository.save(event);
        log.info("Event completed: {}", eventId);
        return updated;
    }

    /**
     * Cancel event
     */
    public Event cancelEvent(UUID eventId, String reason) {
        Event event = getEventById(eventId);

        if (event.getStatus() == EventStatus.COMPLETED) {
            throw new BusinessLogicException("Cannot cancel completed event");
        }

        event.setStatus(EventStatus.CANCELLED);
        Event updated = eventRepository.save(event);
        log.info("Event cancelled: {} - Reason: {}", eventId, reason);
        return updated;
    }

    /**
     * Delete event
     */
    public void deleteEvent(UUID eventId) {
        Event event = getEventById(eventId);

        if (event.getParticipants().size() > 0) {
            throw new BusinessLogicException("Cannot delete event with registered participants");
        }

        eventRepository.delete(event);
        log.info("Event deleted: {}", eventId);
    }

    /**
     * Get event stats
     */
    @Transactional(readOnly = true)
    public EventStats getEventStats(UUID eventId) {
        Event event = getEventById(eventId);
        int participantCount = event.getParticipants().size();
        int remainingCapacity = getRemainingCapacity(eventId);

        return EventStats.builder()
                .eventId(eventId)
                .participantCount(participantCount)
                .maxCapacity(event.getMaxParticipants() == 0 ? Integer.MAX_VALUE : event.getMaxParticipants())
                .remainingCapacity(remainingCapacity)
                .isFull(event.isFull())
                .status(event.getStatus())
                .build();
    }

    /**
     * Helper class for event statistics
     */
    @lombok.Data
    @lombok.Builder
    public static class EventStats {
        private UUID eventId;
        private int participantCount;
        private int maxCapacity;
        private int remainingCapacity;
        private boolean isFull;
        private EventStatus status;
    }
}
