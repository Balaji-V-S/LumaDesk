package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.IssueCategoryCreationRequest;
import com.lumadesk.ticket_service.dto.IssueCategoryUpdationRequest;
import com.lumadesk.ticket_service.entities.IssueCategory;

import java.util.List;

public interface IssueCategoryService {

    IssueCategory createIssueCategory(IssueCategoryCreationRequest request);

    IssueCategory updateIssueCategory(IssueCategoryUpdationRequest request);

    List<IssueCategory> getAllIssueCategories();

    IssueCategory getIssueCategoryById(Long categoryId);

    void deleteIssueCategory(Long categoryId);
}
