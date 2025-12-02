package com.archipellibre.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumPostUpdateRequest {

    @Size(max = 10000, message = "Content must be at most 10000 characters")
    private String content;
}
