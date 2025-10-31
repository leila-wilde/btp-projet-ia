package com.archipellibre.repository;

import com.archipellibre.model.ForumPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ForumPostRepository extends JpaRepository<ForumPost, UUID> {
    
    Page<ForumPost> findByThreadId(UUID threadId, Pageable pageable);
    
    Page<ForumPost> findByAuthorId(UUID authorId, Pageable pageable);
    
    Long countByThreadId(UUID threadId);
}
