package com.archipellibre.dto;

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
public class ForumThreadResponse {

    private UUID id;
    private String title;
    private String content;
    private String category;
    private boolean pinned;
    private boolean locked;
    private UserResponse creator;
    private List<ForumPostResponse> posts;
    private long postCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastActivityAt;
}
