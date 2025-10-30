package com.lumadesk.ticket_service.service;

import com.lumadesk.ticket_service.dto.IssueCategoryCreationRequest;
import com.lumadesk.ticket_service.dto.IssueCategoryUpdationRequest;
import com.lumadesk.ticket_service.entities.IssueCategory;
import com.lumadesk.ticket_service.exception.ResourceNotFoundException;
import com.lumadesk.ticket_service.repository.IssueCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueCategoryServiceImpl implements IssueCategoryService {

    private final IssueCategoryRepository issueCategoryRepository;

    @Override
    @Transactional
    public IssueCategory createIssueCategory(IssueCategoryCreationRequest request) {
        IssueCategory newIssueCategory = new IssueCategory();
        newIssueCategory.setCategoryName(request.getCategoryName());
        return issueCategoryRepository.save(newIssueCategory);
    }

    @Override
    @Transactional
    public IssueCategory updateIssueCategory(IssueCategoryUpdationRequest request) {
        IssueCategory existingCategory = issueCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Issue Category not found with ID: " + request.getCategoryId()));
        existingCategory.setCategoryName(request.getCategoryName());
        return issueCategoryRepository.save(existingCategory);
    }

    @Override
    @Transactional(readOnly = true)
    public List<IssueCategory> getAllIssueCategories() {
        return issueCategoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public IssueCategory getIssueCategoryById(Long categoryId) {
        return issueCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue Category not found with ID: " + categoryId));
    }

    @Override
    @Transactional
    public void deleteIssueCategory(Long categoryId) {
        if (!issueCategoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Issue Category not found with ID: " + categoryId);
        }
        issueCategoryRepository.deleteById(categoryId);
    }
}
