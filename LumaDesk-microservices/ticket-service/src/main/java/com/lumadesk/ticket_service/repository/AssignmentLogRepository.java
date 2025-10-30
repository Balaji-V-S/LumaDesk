package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.AssignmentLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentLogRepository extends JpaRepository<AssignmentLog, Long> {
}
