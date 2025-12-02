package com.archipellibre.dto;

import com.archipellibre.model.EventStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {

    private UUID id;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private String imageUrl;
    private Integer maxParticipants;
    private Integer participantCount;
    private EventStatus status;
    private UserResponse organizer;
    private List<UserResponse> participants;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
