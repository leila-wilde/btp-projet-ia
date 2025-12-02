package com.archipellibre.service;

import com.archipellibre.dto.EventCreateRequest;
import com.archipellibre.dto.EventUpdateRequest;
import com.archipellibre.exception.BusinessLogicException;
import com.archipellibre.exception.ResourceNotFoundException;
import com.archipellibre.model.Event;
import com.archipellibre.model.EventStatus;
import com.archipellibre.model.User;
import com.archipellibre.model.UserRole;
import com.archipellibre.repository.EventRepository;
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

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
@DisplayName("EventService Integration Tests")
class EventServiceTest {

    @Autowired
    private EventService eventService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User organizer;
    private User participant1;
    private User participant2;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
        userRepository.deleteAll();

        startTime = LocalDateTime.now().plusDays(7);
        endTime = startTime.plusHours(2);

        organizer = User.builder()
                .username("organizer")
                .email("organizer@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        participant1 = User.builder()
                .username("participant1")
                .email("participant1@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        participant2 = User.builder()
                .username("participant2")
                .email("participant2@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.USER)
                .active(true)
                .build();

        userRepository.save(organizer);
        userRepository.save(participant1);
        userRepository.save(participant2);
    }

    // ===== CREATE EVENT TESTS =====

    @Test
    @DisplayName("Should create event successfully")
    void testCreateEvent() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Tech Conference 2025")
                .description("Annual tech conference")
                .startTime(startTime)
                .endTime(endTime)
                .location("City Hall")
                .maxParticipants(100)
                .build();

        Event created = eventService.createEvent(organizer.getId(), request);

        assertNotNull(created.getId());
        assertEquals("Tech Conference 2025", created.getTitle());
        assertEquals(organizer.getId(), created.getOrganizer().getId());
        assertEquals(EventStatus.SCHEDULED, created.getStatus());
        assertEquals(0, created.getParticipants().size());
    }

    @Test
    @DisplayName("Should throw exception when start time is in past")
    void testCreateEventWithPastStartTime() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Past Event")
                .description("Description")
                .startTime(LocalDateTime.now().minusHours(1))
                .endTime(LocalDateTime.now().plusHours(1))
                .build();

        assertThrows(BusinessLogicException.class, 
            () -> eventService.createEvent(organizer.getId(), request));
    }

    @Test
    @DisplayName("Should throw exception when end time before start time")
    void testCreateEventWithInvalidTimeRange() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Event")
                .description("Description")
                .startTime(startTime)
                .endTime(startTime.minusHours(1))
                .build();

        assertThrows(BusinessLogicException.class,
            () -> eventService.createEvent(organizer.getId(), request));
    }

    // ===== GET TESTS =====

    @Test
    @DisplayName("Should get event by ID")
    void testGetEventById() {
        Event event = createTestEvent();

        Event found = eventService.getEventById(event.getId());

        assertNotNull(found);
        assertEquals(event.getId(), found.getId());
        assertEquals("Test Event", found.getTitle());
    }

    @Test
    @DisplayName("Should throw exception when event not found")
    void testGetEventByIdNotFound() {
        assertThrows(ResourceNotFoundException.class,
            () -> eventService.getEventById(UUID.randomUUID()));
    }

    @Test
    @DisplayName("Should get all events with pagination")
    void testGetAllEvents() {
        createTestEvent();
        createTestEvent();

        Pageable pageable = PageRequest.of(0, 10);
        var events = eventService.getAllEvents(pageable);

        assertEquals(2, events.getTotalElements());
    }

    @Test
    @DisplayName("Should get events by status")
    void testGetEventsByStatus() {
        Event event1 = createTestEvent();
        Event event2 = createTestEvent();
        event2.setStatus(EventStatus.COMPLETED);
        eventRepository.save(event2);

        Pageable pageable = PageRequest.of(0, 10);
        var scheduled = eventService.getEventsByStatus(EventStatus.SCHEDULED, pageable);
        var completed = eventService.getEventsByStatus(EventStatus.COMPLETED, pageable);

        assertEquals(1, scheduled.getTotalElements());
        assertEquals(1, completed.getTotalElements());
    }

    @Test
    @DisplayName("Should get events by organizer")
    void testGetEventsByOrganizer() {
        Event event1 = createTestEvent();

        User otherOrganizer = User.builder()
                .username("other_org")
                .email("other@example.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(UserRole.USER)
                .active(true)
                .build();
        userRepository.save(otherOrganizer);

        EventCreateRequest request = EventCreateRequest.builder()
                .title("Other Event")
                .description("Description")
                .startTime(startTime)
                .endTime(endTime)
                .build();
        eventService.createEvent(otherOrganizer.getId(), request);

        Pageable pageable = PageRequest.of(0, 10);
        var events = eventService.getEventsByOrganizer(organizer.getId(), pageable);

        assertEquals(1, events.getTotalElements());
    }

    // ===== REGISTRATION TESTS =====

    @Test
    @DisplayName("Should register user for event")
    void testRegisterUserForEvent() {
        Event event = createTestEvent();

        Event updated = eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertEquals(1, updated.getParticipants().size());
        assertTrue(updated.getParticipants().stream()
                .anyMatch(p -> p.getId().equals(participant1.getId())));
    }

    @Test
    @DisplayName("Should throw exception when user already registered")
    void testRegisterUserAlreadyRegistered() {
        Event event = createTestEvent();
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertThrows(BusinessLogicException.class,
            () -> eventService.registerUserForEvent(event.getId(), participant1.getId()));
    }

    @Test
    @DisplayName("Should throw exception when event is full")
    void testRegisterUserEventFull() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Limited Event")
                .description("Only 1 participant")
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(1)
                .build();
        Event event = eventService.createEvent(organizer.getId(), request);

        eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertThrows(BusinessLogicException.class,
            () -> eventService.registerUserForEvent(event.getId(), participant2.getId()));
    }

    @Test
    @DisplayName("Should unregister user from event")
    void testUnregisterUserFromEvent() {
        Event event = createTestEvent();
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        Event updated = eventService.unregisterUserFromEvent(event.getId(), participant1.getId());

        assertEquals(0, updated.getParticipants().size());
    }

    @Test
    @DisplayName("Should throw exception when unregistering non-participant")
    void testUnregisterNonParticipant() {
        Event event = createTestEvent();

        assertThrows(BusinessLogicException.class,
            () -> eventService.unregisterUserFromEvent(event.getId(), participant1.getId()));
    }

    // ===== CAPACITY TESTS =====

    @Test
    @DisplayName("Should check if user is registered")
    void testIsUserRegistered() {
        Event event = createTestEvent();
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertTrue(eventService.isUserRegistered(event.getId(), participant1.getId()));
        assertFalse(eventService.isUserRegistered(event.getId(), participant2.getId()));
    }

    @Test
    @DisplayName("Should get participant count")
    void testGetParticipantCount() {
        Event event = createTestEvent();
        eventService.registerUserForEvent(event.getId(), participant1.getId());
        eventService.registerUserForEvent(event.getId(), participant2.getId());

        long count = eventService.getParticipantCount(event.getId());

        assertEquals(2, count);
    }

    @Test
    @DisplayName("Should get remaining capacity")
    void testGetRemainingCapacity() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Event")
                .description("Description")
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(5)
                .build();
        Event event = eventService.createEvent(organizer.getId(), request);
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        int remaining = eventService.getRemainingCapacity(event.getId());

        assertEquals(4, remaining);
    }

    @Test
    @DisplayName("Should return max int for unlimited capacity")
    void testGetRemainingCapacityUnlimited() {
        Event event = createTestEvent();

        int remaining = eventService.getRemainingCapacity(event.getId());

        assertEquals(Integer.MAX_VALUE, remaining);
    }

    @Test
    @DisplayName("Should check if event is full")
    void testIsEventFull() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Event")
                .description("Description")
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(1)
                .build();
        Event event = eventService.createEvent(organizer.getId(), request);

        assertFalse(eventService.isEventFull(event.getId()));

        eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertTrue(eventService.isEventFull(event.getId()));
    }

    // ===== STATUS TESTS =====

    @Test
    @DisplayName("Should start event")
    void testStartEvent() {
        // Create event with start time in future
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Test Event")
                .description("Test Description")
                .startTime(LocalDateTime.now().plusMinutes(5))
                .endTime(LocalDateTime.now().plusHours(2))
                .build();
        Event event = eventService.createEvent(organizer.getId(), request);
        
        // Manually set start time to past for testing the start functionality
        event.setStartTime(LocalDateTime.now().minusMinutes(1));
        eventRepository.save(event);

        Event started = eventService.startEvent(event.getId());

        assertEquals(EventStatus.IN_PROGRESS, started.getStatus());
    }

    @Test
    @DisplayName("Should throw exception when starting non-scheduled event")
    void testStartEventNotScheduled() {
        Event event = createTestEvent();
        event.setStatus(EventStatus.COMPLETED);
        eventRepository.save(event);

        assertThrows(BusinessLogicException.class,
            () -> eventService.startEvent(event.getId()));
    }

    @Test
    @DisplayName("Should complete event")
    void testCompleteEvent() {
        Event event = createTestEvent();
        event.setStatus(EventStatus.IN_PROGRESS);
        eventRepository.save(event);

        Event completed = eventService.completeEvent(event.getId());

        assertEquals(EventStatus.COMPLETED, completed.getStatus());
    }

    @Test
    @DisplayName("Should cancel event")
    void testCancelEvent() {
        Event event = createTestEvent();

        Event cancelled = eventService.cancelEvent(event.getId(), "Weather issues");

        assertEquals(EventStatus.CANCELLED, cancelled.getStatus());
    }

    @Test
    @DisplayName("Should throw exception when cancelling completed event")
    void testCancelCompletedEvent() {
        Event event = createTestEvent();
        event.setStatus(EventStatus.COMPLETED);
        eventRepository.save(event);

        assertThrows(BusinessLogicException.class,
            () -> eventService.cancelEvent(event.getId(), "Reason"));
    }

    // ===== DELETE TESTS =====

    @Test
    @DisplayName("Should delete event")
    void testDeleteEvent() {
        Event event = createTestEvent();

        eventService.deleteEvent(event.getId());

        assertThrows(ResourceNotFoundException.class,
            () -> eventService.getEventById(event.getId()));
    }

    @Test
    @DisplayName("Should throw exception when deleting event with participants")
    void testDeleteEventWithParticipants() {
        Event event = createTestEvent();
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        assertThrows(BusinessLogicException.class,
            () -> eventService.deleteEvent(event.getId()));
    }

    // ===== UPDATE TESTS =====

    @Test
    @DisplayName("Should update event details")
    void testUpdateEvent() {
        Event event = createTestEvent();
        EventUpdateRequest request = EventUpdateRequest.builder()
                .title("Updated Title")
                .description("Updated description")
                .build();

        Event updated = eventService.updateEvent(event.getId(), request);

        assertEquals("Updated Title", updated.getTitle());
        assertEquals("Updated description", updated.getDescription());
    }

    @Test
    @DisplayName("Should throw exception when updating completed event")
    void testUpdateCompletedEvent() {
        Event event = createTestEvent();
        event.setStatus(EventStatus.COMPLETED);
        eventRepository.save(event);

        EventUpdateRequest request = EventUpdateRequest.builder()
                .title("New title")
                .build();

        assertThrows(BusinessLogicException.class,
            () -> eventService.updateEvent(event.getId(), request));
    }

    @Test
    @DisplayName("Should get event stats")
    void testGetEventStats() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Event")
                .description("Description")
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(10)
                .build();
        Event event = eventService.createEvent(organizer.getId(), request);
        eventService.registerUserForEvent(event.getId(), participant1.getId());

        var stats = eventService.getEventStats(event.getId());

        assertEquals(1, stats.getParticipantCount());
        assertEquals(10, stats.getMaxCapacity());
        assertEquals(9, stats.getRemainingCapacity());
        assertFalse(stats.isFull());
    }

    // ===== HELPER METHODS =====

    private Event createTestEvent() {
        EventCreateRequest request = EventCreateRequest.builder()
                .title("Test Event")
                .description("Test Description")
                .startTime(startTime)
                .endTime(endTime)
                .maxParticipants(0) // Unlimited
                .build();
        return eventService.createEvent(organizer.getId(), request);
    }
}
