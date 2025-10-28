package com.archipellibre.repository;

import com.archipellibre.model.Event;
import com.archipellibre.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface EventRepository extends JpaRepository<Event, UUID> {
    
    Page<Event> findByStatus(EventStatus status, Pageable pageable);
    
    Page<Event> findByOrganizerId(UUID organizerId, Pageable pageable);
    
    @Query("SELECT e FROM Event e WHERE e.startTime >= :startDate AND e.startTime <= :endDate")
    List<Event> findEventsBetweenDates(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("SELECT e FROM Event e JOIN e.participants p WHERE p.id = :userId")
    Page<Event> findEventsByParticipantId(UUID userId, Pageable pageable);
}
