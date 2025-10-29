package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.SLA;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SLARepository extends JpaRepository<SLA, Long> {
}
