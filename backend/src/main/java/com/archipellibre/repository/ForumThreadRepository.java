package com.archipellibre.repository;

import com.archipellibre.model.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ForumThreadRepository extends JpaRepository<ForumThread, UUID> {
    
    Page<ForumThread> findByCategory(String category, Pageable pageable);
    
    Page<ForumThread> findByCreatorId(UUID creatorId, Pageable pageable);
    
    List<ForumThread> findByPinnedTrue();
    
    Page<ForumThread> findAllByOrderByLastActivityAtDesc(Pageable pageable);
}
