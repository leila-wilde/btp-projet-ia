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
public class ForumThreadUpdateRequest {

    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @Size(max = 10000, message = "Content must be at most 10000 characters")
    private String content;

    @Size(max = 50, message = "Category must be at most 50 characters")
    private String category;
}
