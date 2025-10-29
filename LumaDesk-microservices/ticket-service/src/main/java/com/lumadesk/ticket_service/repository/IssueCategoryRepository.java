package com.lumadesk.ticket_service.repository;

import com.lumadesk.ticket_service.entities.IssueCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueCategoryRepository extends JpaRepository<IssueCategory, Long> {
}
