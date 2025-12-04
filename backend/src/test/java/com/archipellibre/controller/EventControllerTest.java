package com.archipellibre.controller;

import com.archipellibre.dto.EventCreateRequest;
import com.archipellibre.dto.EventUpdateRequest;
import com.archipellibre.dto.LoginRequest;
import com.archipellibre.dto.RegisterRequest;
import com.archipellibre.model.Event;
import com.archipellibre.model.User;
import com.archipellibre.repository.EventRepository;
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

import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@SuppressWarnings("null")
class EventControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    private Event testEvent;

    @BeforeEach
    void setUp() {
        eventRepository.deleteAll();
        userRepository.deleteAll();

        testEvent = null;
    }

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

    // ===== GET ENDPOINTS (No auth required) =====

    @Test
    void shouldGetEventById() throws Exception {
        setupTestEvent();

        mockMvc.perform(get("/api/events/" + testEvent.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testEvent.getId().toString()))
                .andExpect(jsonPath("$.title").value("Community Meetup"))
                .andExpect(jsonPath("$.description").value("A great community event"));
    }

    @Test
    void shouldGetEventByIdNotFound() throws Exception {
        UUID nonExistentId = UUID.randomUUID();
        
        mockMvc.perform(get("/api/events/" + nonExistentId))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldGetAllEvents() throws Exception {
        setupTestEvent();
        
        mockMvc.perform(get("/api/events?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].title").value("Community Meetup"));
    }

    @Test
    void shouldGetEventsByStatus() throws Exception {
        String token = registerAndLogin("organizer", "organizer@example.com", "Password123!");
        
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("Test Event");
        request.setDescription("Test");
        request.setStartTime(LocalDateTime.now().plusDays(10));
        request.setEndTime(LocalDateTime.now().plusDays(10).plusHours(2));
        request.setMaxParticipants(50);

        mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/events/status/SCHEDULED?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].status").value("SCHEDULED"));
    }

    @Test
    void shouldGetUpcomingEvents() throws Exception {
        setupTestEvent();
        
        mockMvc.perform(get("/api/events/upcoming?page=0&size=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalElements").value(1))
                .andExpect(jsonPath("$.content[0].title").value("Community Meetup"));
    }

    @Test
    void shouldGetParticipantCount() throws Exception {
        setupTestEvent();

        mockMvc.perform(get("/api/events/" + testEvent.getId() + "/participants/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void shouldGetRemainingCapacity() throws Exception {
        setupTestEvent();

        mockMvc.perform(get("/api/events/" + testEvent.getId() + "/capacity/remaining"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Remaining: 50"));
    }

    @Test
    void shouldCheckEventNotFull() throws Exception {
        setupTestEvent();

        mockMvc.perform(get("/api/events/" + testEvent.getId() + "/is-full"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Seats available"));
    }

    @Test
    void shouldGetEventStats() throws Exception {
        setupTestEvent();

        mockMvc.perform(get("/api/events/" + testEvent.getId() + "/stats"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void shouldCheckUserNotRegistered() throws Exception {
        setupTestEvent();
        User participant = userRepository.findByUsername("organizer").orElseThrow();

        mockMvc.perform(get("/api/events/" + testEvent.getId() + "/registered/" + participant.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User is not registered"));
    }

    // ===== CREATE AND MODIFY TESTS (requires auth) =====

    @Test
    void shouldCreateEvent() throws Exception {
        String token = registerAndLogin("creator", "creator@example.com", "Password123!");
        
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("New Event");
        request.setDescription("Event description");
        request.setStartTime(LocalDateTime.now().plusDays(10));
        request.setEndTime(LocalDateTime.now().plusDays(10).plusHours(3));
        request.setLocation("Tech Hub");
        request.setMaxParticipants(100);

        mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("New Event"))
                .andExpect(jsonPath("$.maxParticipants").value(100))
                .andExpect(jsonPath("$.status").value("SCHEDULED"));
    }

    @Test
    void shouldNotCreateEventWithoutAuthentication() throws Exception {
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("New Event");
        request.setDescription("Event description");
        request.setStartTime(LocalDateTime.now().plusDays(10));
        request.setEndTime(LocalDateTime.now().plusDays(10).plusHours(3));
        request.setMaxParticipants(100);

        mockMvc.perform(post("/api/events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldUpdateEvent() throws Exception {
        setupTestEvent();
        String organizerPassword = "Password123!";
        String token = registerAndLogin("eventorganizer", "eventorg@example.com", organizerPassword);
        
        // Create an event first
        EventCreateRequest createRequest = new EventCreateRequest();
        createRequest.setTitle("Original Title");
        createRequest.setDescription("Original description");
        createRequest.setStartTime(LocalDateTime.now().plusDays(10));
        createRequest.setEndTime(LocalDateTime.now().plusDays(10).plusHours(2));
        createRequest.setMaxParticipants(50);

        MvcResult createResult = mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode createNode = objectMapper.readTree(createResult.getResponse().getContentAsString());
        String eventId = createNode.get("id").asText();

        // Update the event
        EventUpdateRequest updateRequest = new EventUpdateRequest();
        updateRequest.setTitle("Updated Title");
        updateRequest.setDescription("Updated description");
        updateRequest.setMaxParticipants(75);

        mockMvc.perform(put("/api/events/" + eventId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.maxParticipants").value(75));
    }

    @Test
    void shouldNotUpdateNonExistentEvent() throws Exception {
        String token = registerAndLogin("updater", "updater@example.com", "Password123!");
        UUID nonExistentId = UUID.randomUUID();
        
        EventUpdateRequest request = new EventUpdateRequest();
        request.setTitle("Updated Title");

        mockMvc.perform(put("/api/events/" + nonExistentId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    // ===== HELPER METHOD =====

    private void setupTestEvent() throws Exception {
        String token = registerAndLogin("organizer", "organizer@example.com", "Password123!");
        
        EventCreateRequest request = new EventCreateRequest();
        request.setTitle("Community Meetup");
        request.setDescription("A great community event");
        request.setStartTime(LocalDateTime.now().plusDays(7));
        request.setEndTime(LocalDateTime.now().plusDays(7).plusHours(2));
        request.setLocation("Community Center");
        request.setMaxParticipants(50);

        MvcResult result = mockMvc.perform(post("/api/events")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(response);
        String eventId = jsonNode.get("id").asText();
        testEvent = eventRepository.findById(UUID.fromString(eventId)).orElseThrow();
    }
}
