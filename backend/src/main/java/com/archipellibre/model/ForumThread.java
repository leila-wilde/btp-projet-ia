package com.archipellibre.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "forum_threads")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ForumThread {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank
    @Size(min = 3, max = 200)
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Size(max = 10000)
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Boolean pinned = false;

    @Column(nullable = false)
    private Boolean locked = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @OneToMany(mappedBy = "thread", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ForumPost> posts = new ArrayList<>();

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private LocalDateTime lastActivityAt;
}
