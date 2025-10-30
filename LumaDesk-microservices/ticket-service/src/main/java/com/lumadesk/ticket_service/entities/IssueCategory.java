package com.lumadesk.ticket_service.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "issue_categories")
@Data
@NoArgsConstructor
public class IssueCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    @NotBlank(message="Category name is required")
    @Size(min=2, max=50, message="Category name must be between 2 and 50 characters")
    @Column(nullable = false, unique = true)
    private String categoryName;
}
