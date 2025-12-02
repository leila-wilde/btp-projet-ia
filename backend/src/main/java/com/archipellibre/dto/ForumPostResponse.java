package com.archipellibre.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPostResponse {

    private UUID id;
    private String content;
    private UserResponse author;
    private UUID threadId;
    private boolean edited;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
