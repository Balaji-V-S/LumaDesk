package com.lumadesk.ticket_service.controller;

import com.lumadesk.ticket_service.dto.IssueCategoryCreationRequest;
import com.lumadesk.ticket_service.dto.IssueCategoryUpdationRequest;
import com.lumadesk.ticket_service.entities.IssueCategory;
import com.lumadesk.ticket_service.service.IssueCategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/issue-categories")
public class IssueCategoryController {

    @Autowired
    private IssueCategoryService issueCategoryService;

    @PostMapping("/create")
    public ResponseEntity<IssueCategory> createIssueCategory(@Valid @RequestBody IssueCategoryCreationRequest request) {
        IssueCategory createdCategory = issueCategoryService.createIssueCategory(request);
        return ResponseEntity.ok(createdCategory);
    }

    @PutMapping("/update")
    public ResponseEntity<IssueCategory> updateIssueCategory(@Valid @RequestBody IssueCategoryUpdationRequest request) {
        IssueCategory updatedCategory = issueCategoryService.updateIssueCategory(request);
        return ResponseEntity.ok(updatedCategory);
    }

    @GetMapping("/all")
    public ResponseEntity<List<IssueCategory>> getAllIssueCategories() {
        List<IssueCategory> categories = issueCategoryService.getAllIssueCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/get/{categoryId}")
    public ResponseEntity<IssueCategory> getIssueCategoryById(@PathVariable Long categoryId) {
        IssueCategory category = issueCategoryService.getIssueCategoryById(categoryId);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteIssueCategory(@RequestParam Long categoryId) {
        issueCategoryService.deleteIssueCategory(categoryId);
        return ResponseEntity.ok("Issue Category deleted successfully");
    }
}
