package com.archipellibre.repository;

import com.archipellibre.model.ProposalStatus;
import com.archipellibre.model.WorkshopProposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface WorkshopProposalRepository extends JpaRepository<WorkshopProposal, UUID> {
    
    Page<WorkshopProposal> findByStatus(ProposalStatus status, Pageable pageable);
    
    Page<WorkshopProposal> findByProposerId(UUID proposerId, Pageable pageable);
    
    Page<WorkshopProposal> findAllByOrderByUpvotesDesc(Pageable pageable);
}
